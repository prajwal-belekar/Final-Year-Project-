export type ModelPathway = 'adult_multimodal' | 'paediatric_mobilenetv2'
export type DiagnosisResult = 'MVP Detected' | 'Abnormal (Murmur Detected)' | 'Normal'
export type Gender = 'Male' | 'Female' | 'Other'
export type AnalysisStatus = 'completed' | 'processing' | 'failed'

export interface PatientInfo {
  patientId: string
  age: number
  gender: Gender
  notes?: string
}

export interface UploadedFile {
  file: File | null
  filename: string
  size: number
  duration?: number
  previewUrl?: string
}

export interface AnalysisConfig {
  patient: PatientInfo
  pathway: ModelPathway
  pcgUploaded: boolean
  ecgUploaded: boolean
  model: string
  explainability: string
  threshold: number
}

export interface PredictionResult {
  analysisId: string
  patient: PatientInfo
  pathway: ModelPathway
  diagnosis: DiagnosisResult
  probability: number
  threshold: number
  timestamp: string
  architecture?: string
  recommendation?: string
  status?: string
  modelRoute?: string
  backendProbability?: number
  backendThreshold?: number
}

export interface ModelMetrics {
  accuracy: number
  sensitivity: number
  specificity: number
  precision: number
  f1Score: number
  aucRoc: number
}

export interface APIResponse<T> {
  success: boolean
  data: T
  message?: string
}
