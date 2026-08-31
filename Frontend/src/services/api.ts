import type { PatientInfo, PredictionResult, APIResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const STORED_RESULTS_KEY = 'cardio-backend-results'

interface BackendPrediction {
  status: 'success'
  architecture: string
  patient_age: number
  model_routed: 'adult' | 'pediatric'
  abnormality_probability: number
  decision_threshold: number
  diagnosis: 'Abnormal (Murmur Detected)' | 'Normal'
  recommendation: string
}

const getErrorMessage = async (res: Response) => {
  try {
    const body = await res.json() as { detail?: string; message?: string }
    return body.detail || body.message || `Backend request failed (${res.status})`
  } catch {
    return `Backend request failed (${res.status})`
  }
}

const normalizePrediction = (response: BackendPrediction, patient: PatientInfo): PredictionResult => ({
  analysisId: `ANL-${Date.now()}`,
  patient: { ...patient, age: response.patient_age },
  pathway: response.model_routed === 'adult' ? 'adult_multimodal' : 'paediatric_mobilenetv2',
  diagnosis: response.diagnosis,
  probability: response.abnormality_probability * 100,
  threshold: response.decision_threshold * 100,
  timestamp: new Date().toISOString(),
  architecture: response.architecture,
  recommendation: response.recommendation,
  status: response.status,
  modelRoute: response.model_routed,
  backendProbability: response.abnormality_probability,
  backendThreshold: response.decision_threshold,
})

export const api = {
  async getStatus(): Promise<APIResponse<{ status: string; models: Record<string, string> }>> {
    const res = await fetch(`${API_BASE_URL}/openapi.json`)
    if (!res.ok) throw new Error(await getErrorMessage(res))
    return {
      success: true,
      data: { status: 'online', models: {} },
    }
  },

  async predict(
    patient: PatientInfo,
    pcgFile: File,
    ecgFile?: File
  ): Promise<APIResponse<PredictionResult>> {
    const formData = new FormData()
    formData.append('audio', pcgFile)
    if (ecgFile) formData.append('ecg', ecgFile)
    formData.append('age', String(patient.age))

    const res = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error(await getErrorMessage(res))
    const response = await res.json() as BackendPrediction
    const result = normalizePrediction(response, patient)
    const storedResults = JSON.parse(localStorage.getItem(STORED_RESULTS_KEY) || '[]') as PredictionResult[]
    localStorage.setItem(STORED_RESULTS_KEY, JSON.stringify([result, ...storedResults]))
    return { success: true, data: result }
  },

  getStoredResults(): PredictionResult[] {
    try {
      return JSON.parse(localStorage.getItem(STORED_RESULTS_KEY) || '[]') as PredictionResult[]
    } catch {
      return []
    }
  },

  async getResult(analysisId: string): Promise<APIResponse<PredictionResult>> {
    const stored = api.getStoredResults().find(result => result.analysisId === analysisId)
    if (stored) return { success: true, data: stored }
    throw new Error('This result is not available in the current session.')
  },
}
