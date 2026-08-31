import os
import sys

# --- FIX PYTHON PATH BEFORE IMPORTING LOCAL MODULES ---
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import io
import base64
import re
import numpy as np
import librosa
import scipy.signal
import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import config

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

app = FastAPI(title="Hridaya Vacha Multimodal AI Backend", version="5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS = {}


@app.on_event("startup")
async def load_models():
    """Loads the exact saved architectures natively using TF 2.16+"""
    print("🧠 Initializing Multimodal & Pediatric Models into memory...")

    # Dynamically get the project root (one folder up from src/app.py)
    ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    adult_path = next(
        (os.path.join(ROOT_DIR, "models", filename)
         for filename in ("adult_multimodal_best.keras", "adult_ultimate_best.keras")
         if os.path.exists(os.path.join(ROOT_DIR, "models", filename))),
        os.path.join(ROOT_DIR, "models", "adult_multimodal_best.keras"),
    )
    ped_path = os.path.join(ROOT_DIR, "models", "pediatric_ultimate_best.keras")

    try:
        if os.path.exists(adult_path):
            MODELS["adult"] = tf.keras.models.load_model(adult_path, compile=False)
        else:
            print(f"⚠️ WARNING: Could not find Adult model at {adult_path}")

        if os.path.exists(ped_path):
            MODELS["pediatric"] = tf.keras.models.load_model(ped_path, compile=False)
        else:
            print(f"⚠️ WARNING: Could not find Pediatric model at {ped_path}")

        print(f"✅ Startup complete. Active models in memory: {list(MODELS.keys())}")
    except Exception as e:
        print(f"❌ Model loading error: {e}")


# --- SIGNAL PROCESSING ---
def native_ricker(points, a):
    A = 2 / (np.sqrt(3 * a) * (np.pi ** 0.25))
    t = np.arange(0, points) - (points - 1) / 2.0
    return A * (1 - t ** 2 / a ** 2) * np.exp(-t ** 2 / (2 * a ** 2))


def generate_cwt_matrix(audio_signal, sr, target_size=(224, 224)):
    widths = np.arange(1, 64)
    cwtmatr = np.zeros((len(widths), len(audio_signal)), dtype=np.float32)
    for i, width in enumerate(widths):
        n_points = int(min(len(audio_signal), 4 * width + 1))
        if n_points % 2 == 0: n_points += 1
        wavelet = native_ricker(n_points, width)
        cwtmatr[i, :] = np.abs(scipy.signal.fftconvolve(audio_signal, wavelet, mode='same'))
    x_idx = np.linspace(0, cwtmatr.shape[1] - 1, target_size[1]).astype(int)
    y_idx = np.linspace(0, cwtmatr.shape[0] - 1, target_size[0]).astype(int)
    resized = cwtmatr[np.ix_(y_idx, x_idx)]
    resized = (resized - np.min(resized)) / (np.max(resized) - np.min(resized) + 1e-8)
    return np.expand_dims(resized, axis=-1)


def process_ecg_file(ecg_path, target_size=(224, 224)):
    """Parses a single 1D ECG signal from a .npy or .hea upload."""
    try:
        suffix = os.path.splitext(ecg_path)[1].lower()
        raw_data = None

        if suffix == '.npy':
            raw_data = np.load(ecg_path)
        elif suffix == '.hea':
            with open(ecg_path, 'r', encoding='utf-8', errors='ignore') as f:
                contents = f.read()
            numbers = re.findall(r'[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?', contents)
            if numbers:
                raw_data = np.asarray([float(x) for x in numbers], dtype=np.float32)

        if raw_data is None:
            return np.zeros((*target_size, 1), dtype=np.float32)

        raw_data = np.asarray(raw_data, dtype=np.float32)
        if raw_data.size == 0:
            return np.zeros((*target_size, 1), dtype=np.float32)

        signals = raw_data.reshape(-1)
        if signals.size > 1:
            if signals.shape[0] != target_size[0] * target_size[1]:
                signals = cv2.resize(signals.reshape(-1, 1), target_size).reshape(-1)
            else:
                signals = signals[:target_size[0] * target_size[1]]
        else:
            signals = np.zeros(target_size[0] * target_size[1], dtype=np.float32)

        signals = np.asarray(signals, dtype=np.float32)
        signals = (signals - np.min(signals)) / (np.max(signals) - np.min(signals) + 1e-8)
        resized = cv2.resize(signals.reshape(-1, 1), target_size)
        return np.expand_dims(resized.astype(np.float32), axis=-1)
    except Exception:
        return np.zeros((*target_size, 1), dtype=np.float32)


# --- API ENDPOINTS ---
@app.post("/api/predict")
async def predict(
        audio: UploadFile = File(...),
        ecg: UploadFile = File(None),
        age: int = Form(...)
):
    if not audio.filename.endswith(".wav"):
        raise HTTPException(status_code=400, detail="PCG file must be a .wav format.")

    model_type = "adult" if age >= 18 else "pediatric"

    if model_type not in MODELS:
        raise HTTPException(status_code=500, detail=f"The {model_type} model failed to load into memory on startup.")

    model = MODELS[model_type]

    temp_audio = f"temp_{audio.filename}"
    with open(temp_audio, "wb") as f:
        f.write(await audio.read())

    temp_ecg = None
    if model_type == "adult" and len(model.inputs) > 1:
        if not ecg:
            raise HTTPException(status_code=400,
                                detail="Adult multimodal model requires an ECG file (.hea or .npy).")
        ecg_name = (ecg.filename or '').lower()
        if not (ecg_name.endswith('.hea') or ecg_name.endswith('.npy')):
            raise HTTPException(status_code=400,
                                detail="ECG file must use the .hea or .npy extension.")
        temp_ecg = f"temp_{ecg.filename}"
        with open(temp_ecg, "wb") as f:
            f.write(await ecg.read())

    try:
        y, sr = librosa.load(temp_audio, sr=config.TARGET_SR)
        pcg_2d = generate_cwt_matrix(y, sr)
        pcg_input = np.expand_dims(pcg_2d, axis=0)

        if model_type == "adult" and len(model.inputs) > 1:
            ecg_2d = process_ecg_file(temp_ecg)
            ecg_input = np.expand_dims(ecg_2d, axis=0)

            prob = float(model.predict([pcg_input, ecg_input], verbose=0)[0][0])
            threshold = 0.50
        else:
            prob = float(model.predict(pcg_input, verbose=0)[0][0])
            threshold = 0.50 if model_type == "adult" else 0.82

        is_abnormal = prob >= threshold

        return {
            "status": "success",
            "architecture": "Multimodal Late-Fusion (PCG + ECG)" if model_type == "adult" and len(model.inputs) > 1 else "Unimodal PCG",
            "patient_age": age,
            "model_routed": model_type,
            "abnormality_probability": prob,
            "decision_threshold": threshold,
            "diagnosis": "Abnormal (Murmur Detected)" if is_abnormal else "Normal",
            "recommendation": "Immediate referral for Echocardiogram" if is_abnormal else "Routine monitoring"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_audio): os.remove(temp_audio)
        if temp_ecg and os.path.exists(temp_ecg): os.remove(temp_ecg)