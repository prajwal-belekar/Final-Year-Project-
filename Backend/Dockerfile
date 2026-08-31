FROM hridaya-vacha-backend:latest

RUN cp /app/models/adult_ultimate_best.keras /app/models/adult_multimodal_best.keras

EXPOSE 8000

CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000"]
