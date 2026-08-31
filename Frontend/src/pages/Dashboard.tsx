import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Heart, CheckCircle, Wifi, PlusCircle } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Disclaimer from '../components/ui/Disclaimer'
import { api } from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [storedResults, setStoredResults] = useState(() => api.getStoredResults())
  const [apiOnline, setApiOnline] = useState(false)

  useEffect(() => {
    api.getStatus().then(() => setApiOnline(true)).catch(() => setApiOnline(false))
  }, [])

  useEffect(() => {
    const refreshResults = () => setStoredResults(api.getStoredResults())
    window.addEventListener('storage', refreshResults)
    return () => window.removeEventListener('storage', refreshResults)
  }, [])

  const total = storedResults.length
  const mvpDetected = storedResults.filter(result => result.diagnosis !== 'Normal').length
  const normal = storedResults.filter(result => result.diagnosis === 'Normal').length

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">MVP Detection Dashboard</h1>
          <p className="text-sm text-navy-400 mt-1">
            Multimodal AI-assisted screening using PCG and ECG signals.
          </p>
        </div>
        <button
          onClick={() => navigate('/analysis/new')}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          New Analysis
        </button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Analyses Completed"
          value={total}
          icon={Activity}
          color="cyan"
        />
        <StatCard
          title="MVP Detected"
          value={mvpDetected}
          subtitle={total ? `${((mvpDetected / total) * 100).toFixed(1)}% of stored results` : 'No diagnoses stored'}
          icon={Heart}
          color="red"
        />
        <StatCard
          title="Normal"
          value={normal}
          subtitle={total ? `${((normal / total) * 100).toFixed(1)}% of stored results` : 'No diagnoses stored'}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="API Status"
          value={apiOnline ? 'Connected' : 'Offline'}
          subtitle="FastAPI Backend"
          icon={Wifi}
          color="green"
        />
      </div>

      {/* Recent Analysis Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card overflow-hidden"
      >
        <div className="p-5 border-b border-navy-700/50 flex items-center justify-between">
          <div>
            <h2 className="section-title">Recent Analyses</h2>
            <p className="section-subtitle mt-0.5">Latest screening results</p>
          </div>
        </div>
        <div className="p-8 text-center text-sm text-navy-500">The backend does not provide analysis history yet.</div>
      </motion.div>

      <Disclaimer variant="compact" />
    </div>
  )
}
