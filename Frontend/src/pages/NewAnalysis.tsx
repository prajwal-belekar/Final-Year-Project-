import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Upload, Mic, Activity, ArrowRight,
  ArrowLeft, CheckCircle, AlertTriangle, Cpu, Zap, Trash2, Play,
  ChevronRight, Heart
} from 'lucide-react'
import Disclaimer from '../components/ui/Disclaimer'
import { cn } from '../lib/utils'
import type { Gender, ModelPathway } from '../types'
import { api } from '../services/api'

type Step = 0 | 1 | 2 | 3

export default function NewAnalysis() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(0)
  const [patientId, setPatientId] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('Male')
  const [notes, setNotes] = useState('')
  const [pcgFile, setPcgFile] = useState<File | null>(null)
  const [ecgFile, setEcgFile] = useState<File | null>(null)
  const [pcgDragOver, setPcgDragOver] = useState(false)
  const [ecgDragOver, setEcgDragOver] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [processStep, setProcessStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const ageNum = parseInt(age) || 0
  const pathway: ModelPathway = ageNum >= 18 ? 'adult_multimodal' : 'paediatric_mobilenetv2'
  const isAdult = ageNum >= 18
  // pathway is used for display in the routing card
  void pathway

  const handlePcgDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setPcgDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.wav')) {
      setPcgFile(file)
    }
  }, [])

  const handleEcgDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setEcgDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setEcgFile(file)
  }, [])

  const handleAnalyze = async () => {
    if (!pcgFile) return
    setProcessing(true)
    setError(null)
    setProcessStep(0)
    try {
      const result = await api.predict(
        { patientId, age: ageNum, gender, notes },
        pcgFile,
        ecgFile || undefined,
      )
      setProcessStep(processSteps.length - 1)
      setTimeout(() => navigate(`/results/${result.data.analysisId}`, { state: { result: result.data } }), 500)
    } catch (requestError) {
      setProcessing(false)
      setError(requestError instanceof Error ? requestError.message : 'Unable to reach the backend.')
    }
  }

  const canProceed = () => {
    if (step === 0) return patientId && ageNum > 0
    if (step === 1) return pcgFile !== null
    if (step === 2) return true
    return false
  }

  const processSteps = [
    'Upload validated',
    'Feature extraction',
    'Preparing backend response',
  ]

  if (processing) {
    return (
      <div className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-xl flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 max-w-lg w-full text-center"
        >
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/15 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-cyan-400 animate-heartbeat" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Analyzing Cardiac Signals</h2>
            <p className="text-sm text-navy-400">
              Routing patient to {isAdult ? 'Adult Multimodal Model' : 'Paediatric MobileNetV2 Model'}
            </p>
          </div>

          <div className="space-y-2 mb-6">
            {processSteps.map((label, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i <= processStep ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-4 py-2 rounded-lg"
              >
                {i < processStep ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : i === processStep ? (
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-navy-600 flex-shrink-0" />
                )}
                <span className={cn('text-sm', i <= processStep ? 'text-navy-200' : 'text-navy-600')}>
                  {label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="w-full bg-navy-800 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((processStep + 1) / processSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">New MVP Analysis</h1>
        <p className="text-sm text-navy-400 mt-1">
          Upload physiological signals and patient information to begin AI-assisted screening.
        </p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {['Patient Info', 'Signal Upload', 'Review & Submit'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i as Step)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                i === step
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                  : i < step
                  ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-navy-800/50 text-navy-500 border border-navy-700/30'
              )}
            >
              <span className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                i === step ? 'bg-cyan-600 text-white' : i < step ? 'bg-emerald-600 text-white' : 'bg-navy-700 text-navy-400'
              )}>
                {i < step ? '✓' : `0${i + 1}`}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < 2 && <ChevronRight className="w-4 h-4 text-navy-700" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Patient Info */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="card p-6">
              <h2 className="section-title flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-cyan-400" />
                Patient Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-navy-400 mb-1.5 block">Patient ID *</label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={e => setPatientId(e.target.value)}
                    placeholder="e.g. P-001"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-navy-400 mb-1.5 block">Age *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g. 42"
                    min="1"
                    max="120"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-navy-400 mb-1.5 block">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as Gender)}
                    className="input-field w-full"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-navy-400 mb-1.5 block">Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Clinical notes..."
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>

            {/* Model Routing */}
            {ageNum > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'card p-5 border-2',
                  isAdult ? 'border-cyan-500/30' : 'border-amber-500/30'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    isAdult ? 'bg-cyan-500/15' : 'bg-amber-500/15'
                  )}>
                    <Cpu className={cn('w-5 h-5', isAdult ? 'text-cyan-400' : 'text-amber-400')} />
                  </div>
                  <div>
                    <h3 className={cn('text-sm font-semibold', isAdult ? 'text-cyan-300' : 'text-amber-300')}>
                      {isAdult ? 'Adult Backend Pathway' : 'Paediatric Backend Pathway'}
                    </h3>
                    <p className="text-xs text-navy-400">
                      {isAdult ? 'PCG → Backend Adult Model' : 'PCG → Backend Paediatric Model'}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={cn('badge', isAdult ? 'badge-info' : 'badge-warning')}>
                      Age {ageNum} → {isAdult ? 'Adult' : 'Paediatric'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 1: Signal Upload */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* PCG Upload */}
            <div className="card p-6">
              <h2 className="section-title flex items-center gap-2 mb-1">
                <Mic className="w-4 h-4 text-cyan-400" />
                PCG / Heart Sound Recording
              </h2>
              <p className="text-xs text-navy-400 mb-4">Upload the phonocardiogram recording in WAV format.</p>

              {!pcgFile ? (
                <div
                  onDragOver={e => { e.preventDefault(); setPcgDragOver(true) }}
                  onDragLeave={() => setPcgDragOver(false)}
                  onDrop={handlePcgDrop}
                  className={cn(
                    'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
                    pcgDragOver ? 'border-cyan-500 bg-cyan-500/5' : 'border-navy-600/50 hover:border-navy-500/50'
                  )}
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.wav'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) setPcgFile(file)
                    }
                    input.click()
                  }}
                >
                  <Upload className="w-8 h-8 text-navy-500 mx-auto mb-3" />
                  <p className="text-sm text-navy-300 font-medium">Drop PCG recording here</p>
                  <p className="text-xs text-navy-500 mt-1">Supported: .wav</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-navy-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                        <Mic className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy-200">{pcgFile.name}</p>
                        <p className="text-xs text-navy-500">{(pcgFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPcgFile(null)} className="p-1.5 rounded-lg hover:bg-navy-700/50 text-navy-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Pipeline */}
              <div className="mt-4 p-3 bg-navy-800/30 rounded-xl">
                <p className="text-xs text-navy-500 mb-2 font-medium">Signal Processing Pipeline</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {['Raw PCG', 'Filtering', 'Normalization', '5s Segmentation', 'CWT', 'Scalogram'].map((step, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="px-2 py-1 rounded-md bg-navy-700/50 text-[10px] text-navy-300 font-medium">{step}</span>
                      {i < 5 && <ArrowRight className="w-3 h-3 text-navy-600" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ECG Upload */}
            <div className="card p-6">
              <h2 className="section-title flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-emerald-400" />
                ECG Signal
              </h2>
              <p className="text-xs text-navy-400 mb-4">
                {isAdult
                  ? 'The current backend adult model uses PCG input. ECG is optional.'
                  : 'ECG is not required for the paediatric pathway.'}
              </p>

              {!isAdult ? (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-300">ECG not required for this pathway</p>
                    <p className="text-xs text-navy-400">The backend uses PCG input for this model.</p>
                  </div>
                </div>
              ) : !ecgFile ? (
                <div
                  onDragOver={e => { e.preventDefault(); setEcgDragOver(true) }}
                  onDragLeave={() => setEcgDragOver(false)}
                  onDrop={handleEcgDrop}
                  className={cn(
                    'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
                    ecgDragOver ? 'border-emerald-500 bg-emerald-500/5' : 'border-navy-600/50 hover:border-navy-500/50'
                  )}
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.hea,.npy'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) setEcgFile(file)
                    }
                    input.click()
                  }}
                >
                  <Upload className="w-8 h-8 text-navy-500 mx-auto mb-3" />
                  <p className="text-sm text-navy-300 font-medium">Drop ECG data here</p>
                  <p className="text-xs text-navy-500 mt-1">Supported: .hea or .npy</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-navy-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy-200">{ecgFile.name}</p>
                        <p className="text-xs text-navy-500">{(ecgFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={() => setEcgFile(null)} className="p-1.5 rounded-lg hover:bg-navy-700/50 text-navy-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="card p-6">
              <h2 className="section-title flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-cyan-400" />
                Analysis Configuration
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Patient ID', value: patientId },
                  { label: 'Patient Age', value: age },
                  { label: 'Gender', value: gender },
                  { label: 'Detected Pathway', value: isAdult ? 'Adult Multimodal' : 'Paediatric' },
                  { label: 'PCG', value: pcgFile ? 'Uploaded ✓' : 'Not uploaded' },
                  { label: 'ECG', value: !isAdult ? 'Not required' : ecgFile ? 'Uploaded ✓' : 'Not uploaded' },
                  { label: 'Model', value: isAdult ? 'Functional API Multimodal Network' : 'MobileNetV2 Transfer Learning' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-navy-800/30 rounded-lg">
                    <span className="text-xs text-navy-400">{item.label}</span>
                    <span className="text-sm font-medium text-navy-200">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <Disclaimer variant="compact" />

            {error && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button onClick={handleAnalyze} className="btn-primary flex items-center gap-2">
                <Play className="w-4 h-4" />
                Run MVP Analysis
              </button>
              <button onClick={() => { setStep(0); setPcgFile(null); setEcgFile(null) }} className="btn-secondary">
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      {!processing && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => step > 0 && setStep((step - 1) as Step)}
            disabled={step === 0}
            className={cn('flex items-center gap-2 text-sm', step === 0 ? 'text-navy-700' : 'text-navy-400 hover:text-navy-200')}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < 2 && (
            <button
              onClick={() => canProceed() && setStep((step + 1) as Step)}
              disabled={!canProceed()}
              className={cn('btn-primary flex items-center gap-2', !canProceed() && 'opacity-50 cursor-not-allowed')}
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
