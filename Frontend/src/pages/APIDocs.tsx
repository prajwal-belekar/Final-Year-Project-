import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Code, Send, ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { api } from '../services/api'

export default function APIDocs() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    api.getStatus().then(() => setIsConnected(true)).catch(() => setIsConnected(false))
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">API Integration</h1>
        <p className="text-sm text-navy-400 mt-1">FastAPI backend REST API documentation.</p>
      </motion.div>

      {/* API Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isConnected ? 'bg-emerald-500/15' : 'bg-red-500/15')}>
            {isConnected ? <Wifi className="w-5 h-5 text-emerald-400" /> : <WifiOff className="w-5 h-5 text-red-400" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">FastAPI Backend</h2>
            <p className="text-xs text-navy-400">http://localhost:8000</p>
          </div>
        </div>
        <span className={cn('badge', isConnected ? 'badge-success' : 'badge-danger')}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </motion.div>

      {/* POST /api/predict */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Send className="w-4 h-4 text-cyan-400" />
          <h2 className="section-title">POST /api/predict</h2>
          <span className="badge-info">Primary Endpoint</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Request */}
          <div>
            <h3 className="text-xs font-medium text-navy-400 uppercase tracking-wider mb-2">Request (multipart/form-data)</h3>
            <div className="bg-navy-800/50 rounded-xl p-4 font-mono text-xs space-y-1">
              <p className="text-navy-500"># Required</p>
              <p><span className="text-cyan-400">audio</span> <span className="text-navy-500">: File</span> <span className="text-navy-600"># .wav</span></p>
              <p><span className="text-cyan-400">age</span> <span className="text-navy-500">: int</span></p>
              <p className="text-navy-500 mt-2"># ECG required for adult pathway</p>
              <p><span className="text-cyan-400">ecg</span> <span className="text-navy-500">: File</span> <span className="text-navy-600"># .hea or .npy</span></p>
            </div>
          </div>

          {/* Response */}
          <div>
            <h3 className="text-xs font-medium text-navy-400 uppercase tracking-wider mb-2">Response (JSON)</h3>
            <div className="bg-navy-800/50 rounded-xl p-4 font-mono text-xs space-y-1">
              <p className="text-navy-500">{'{'}</p>
              <p className="pl-3"><span className="text-emerald-400">"success"</span>: <span className="text-amber-300">true</span>,</p>
              <p className="pl-3"><span className="text-emerald-400">"abnormality_probability"</span>: <span className="text-amber-300">0.918</span>,</p>
              <p className="pl-3"><span className="text-emerald-400">"decision_threshold"</span>: <span className="text-amber-300">0.5</span>,</p>
              <p className="pl-3"><span className="text-emerald-400">"diagnosis"</span>: <span className="text-amber-300">"Abnormal (Murmur Detected)"</span></p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Other Endpoints */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h2 className="section-title mb-4">Available Endpoints</h2>
        <div className="space-y-2">
          {[
            { method: 'GET', path: '/openapi.json', desc: 'Backend reachability and API schema' },
            { method: 'POST', path: '/api/predict', desc: 'Run PCG or multimodal analysis' },
          ].map((ep, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-navy-800/30 rounded-lg">
              <span className={cn('badge font-mono', ep.method === 'GET' ? 'badge-success' : 'badge-info')}>
                {ep.method}
              </span>
              <code className="text-sm text-navy-200 font-mono">{ep.path}</code>
              <ArrowRight className="w-3 h-3 text-navy-600" />
              <span className="text-xs text-navy-400">{ep.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* JSON Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-4 h-4 text-cyan-400" />
          <h2 className="section-title">Example Response</h2>
        </div>
        <div className="bg-navy-800/50 rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-navy-300">{`{
  "status": "success",
  "architecture": "Multimodal Late-Fusion (PCG + ECG)",
  "patient_age": 42,
  "model_routed": "adult",
  "abnormality_probability": 0.918,
  "decision_threshold": 0.5,
  "diagnosis": "Abnormal (Murmur Detected)",
  "recommendation": "Immediate referral for Echocardiogram"
}`}</pre>
        </div>
      </motion.div>
    </div>
  )
}
