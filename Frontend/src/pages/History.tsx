import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Eye, User } from 'lucide-react'
import { api } from '../services/api'
import { cn } from '../lib/utils'
import type { PredictionResult } from '../types'

export default function History() {
  const navigate = useNavigate()
  const [results, setResults] = useState<PredictionResult[]>([])

  useEffect(() => {
    setResults(api.getStoredResults())
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Previous Diagnoses</h1>
        <p className="text-sm text-navy-400 mt-1">Backend diagnoses stored in this browser.</p>
      </div>

      <div className="card overflow-hidden">
        {results.length === 0 ? (
          <div className="p-8 text-center text-sm text-navy-500">No backend diagnoses have been stored yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700/30">
                  {['Analysis ID', 'Patient', 'Age', 'Route', 'Diagnosis', 'Probability', 'Date', 'View'].map(label => (
                    <th key={label} className="text-left text-xs font-medium text-navy-500 px-5 py-3">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.analysisId} className="border-b border-navy-800/30 hover:bg-navy-800/20">
                    <td className="px-5 py-3 text-sm font-mono text-navy-300">{result.analysisId}</td>
                    <td className="px-5 py-3 text-sm text-navy-200"><User className="inline w-3.5 h-3.5 mr-2 text-navy-500" />{result.patient.patientId}</td>
                    <td className="px-5 py-3 text-sm text-navy-300">{result.patient.age}</td>
                    <td className="px-5 py-3 text-sm text-navy-300">{result.pathway === 'adult_multimodal' ? 'Adult' : 'Paediatric'}</td>
                    <td className="px-5 py-3"><span className={cn('badge', result.diagnosis === 'Normal' ? 'badge-success' : 'badge-danger')}>{result.diagnosis}</span></td>
                    <td className="px-5 py-3 text-sm text-navy-200">{result.probability.toFixed(1)}%</td>
                    <td className="px-5 py-3 text-xs text-navy-400"><Clock className="inline w-3 h-3 mr-1" />{new Date(result.timestamp).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3"><button onClick={() => navigate(`/results/${result.analysisId}`)} className="text-cyan-400 hover:text-cyan-300"><Eye className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
