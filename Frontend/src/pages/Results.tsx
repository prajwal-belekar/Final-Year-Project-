import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Download, Printer, AlertTriangle, CheckCircle, Clock, User, Cpu
} from 'lucide-react'
import Disclaimer from '../components/ui/Disclaimer'
import { cn } from '../lib/utils'
import type { PredictionResult } from '../types'
import { api } from '../services/api'

function BackendPayloadCard({ result }: { result: PredictionResult }) {
  return (
    <div className="card p-5">
      <h3 className="section-title flex items-center gap-2 mb-4">
        <Cpu className="w-4 h-4 text-cyan-400" />
        Backend Response Payload
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-navy-800/30">
          <p className="text-[10px] uppercase tracking-wider text-navy-500">Status</p>
          <p className="text-sm font-semibold text-navy-200 mt-0.5">{result.status || 'unknown'}</p>
        </div>
        <div className="p-3 rounded-xl bg-navy-800/30">
          <p className="text-[10px] uppercase tracking-wider text-navy-500">Model Route</p>
          <p className="text-sm font-semibold text-navy-200 mt-0.5">{result.modelRoute || result.pathway}</p>
        </div>
        <div className="p-3 rounded-xl bg-navy-800/30">
          <p className="text-[10px] uppercase tracking-wider text-navy-500">Architecture</p>
          <p className="text-sm font-semibold text-navy-200 mt-0.5">{result.architecture || 'Not returned'}</p>
        </div>
        <div className="p-3 rounded-xl bg-navy-800/30">
          <p className="text-[10px] uppercase tracking-wider text-navy-500">Backend Threshold</p>
          <p className="text-sm font-semibold text-navy-200 mt-0.5">{(result.backendThreshold ?? result.threshold / 100).toFixed(2)}</p>
        </div>
        <div className="p-3 rounded-xl bg-navy-800/30">
          <p className="text-[10px] uppercase tracking-wider text-navy-500">Backend Probability</p>
          <p className="text-sm font-semibold text-navy-200 mt-0.5">{(result.backendProbability ?? result.probability / 100).toFixed(4)}</p>
        </div>
        <div className="p-3 rounded-xl bg-navy-800/30">
          <p className="text-[10px] uppercase tracking-wider text-navy-500">Patient Age</p>
          <p className="text-sm font-semibold text-navy-200 mt-0.5">{result.patient.age}</p>
        </div>
        <div className="p-3 rounded-xl bg-navy-800/30 sm:col-span-2 lg:col-span-2">
          <p className="text-[10px] uppercase tracking-wider text-navy-500">Recommendation</p>
          <p className="text-sm font-semibold text-navy-200 mt-0.5">{result.recommendation || 'Not provided'}</p>
        </div>
      </div>
    </div>
  )
}

export default function Results() {
  const { id } = useParams()
  const location = useLocation()
  const [liveResult, setLiveResult] = useState<PredictionResult | null>(() => {
    const routeResult = (location.state as { result?: PredictionResult } | null)?.result
    if (routeResult) return routeResult
    return id ? api.getStoredResults().find(result => result.analysisId === id) || null : null
  })

  useEffect(() => {
    if (!id || liveResult?.analysisId === id) return
    api.getResult(id).then(response => setLiveResult(response.data)).catch(() => undefined)
  }, [id, liveResult?.analysisId])

  if (!liveResult) {
    return <div className="card p-8 text-center text-sm text-navy-400">No backend result is available for this analysis.</div>
  }

  const result = liveResult
  const isMVP = result.diagnosis !== 'Normal'
  const isAdult = result.pathway === 'adult_multimodal'

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">AI Screening Result</h1>
            <span className={cn('badge', isMVP ? 'badge-danger' : 'badge-success')}>{result.diagnosis}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-navy-400">
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {result.patient.patientId}</span>
            <span>Age: {result.patient.age}</span>
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {result.architecture || (isAdult ? 'Adult' : 'Paediatric')}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(result.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>
      </motion.div>

      {/* Primary Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'card p-6 border-2 relative overflow-hidden',
          isMVP ? 'border-red-500/30' : 'border-emerald-500/30'
        )}
      >
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-30', isMVP ? 'from-red-500/10 to-transparent' : 'from-emerald-500/10 to-transparent')} />
        <div className="relative flex flex-col lg:flex-row items-center gap-8">
          {/* Result */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-3', isMVP ? 'bg-red-500/15' : 'bg-emerald-500/15')}>
                {isMVP ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <CheckCircle className="w-5 h-5 text-emerald-400" />}
                <span className={cn('text-lg font-bold', isMVP ? 'text-red-400' : 'text-emerald-400')}>
                  {result.diagnosis.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-navy-400 mb-4">
                  {result.recommendation || (isMVP
                    ? 'Abnormal murmur indicators detected by the AI model.'
                    : 'No significant murmur indicators detected by the AI model.')}
              </p>
            </motion.div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-navy-500">Abnormality Probability</p>
                <p className="text-xl font-bold text-white">{result.probability}%</p>
              </div>
              <div>
                <p className="text-xs text-navy-500">Decision Threshold</p>
                <p className="text-xl font-bold text-navy-300">{result.threshold}%</p>
              </div>
              <div>
                <p className="text-xs text-navy-500">Model Route</p>
                <p className="text-sm font-bold text-navy-200">{isAdult ? 'Adult' : 'Pediatric'}</p>
              </div>
            </div>
            <p className="text-xs text-navy-500 mt-3">
              The model probability is {result.probability > result.threshold ? 'above' : 'below'} the configured {isAdult ? 'adult' : 'paediatric'} inference threshold.
            </p>
          </div>

        </div>
      </motion.div>

      <BackendPayloadCard result={result} />

      {/* Screening Interpretation */}
      <div className="card p-5">
        <h3 className="section-title flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-cyan-400" />
          Screening Interpretation
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Classification', value: result.diagnosis },
            { label: 'Probability', value: `${result.probability}%` },
            { label: 'Screening Status', value: isMVP ? 'Flagged' : 'Clear' },
            { label: 'Model Pathway', value: result.architecture || (isAdult ? 'Adult' : 'Paediatric') },
            { label: 'Architecture', value: result.architecture || 'Not returned' },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-navy-800/30 rounded-xl">
              <p className="text-[10px] text-navy-500 uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-semibold text-navy-200 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
        <Disclaimer variant="compact" />
      </div>

      <Disclaimer />
    </div>
  )
}
