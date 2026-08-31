import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Heart, Cpu, Zap } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    { icon: Heart, label: 'PCG + ECG', desc: 'Multimodal signal analysis' },
    { icon: Cpu, label: 'Age-Aware AI', desc: 'Intelligent model routing' },
    { icon: Zap, label: 'Backend Inference', desc: 'Live model prediction' },
    { icon: Zap, label: 'FastAPI Inference', desc: 'Real-time screening' },
  ]

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-medium text-cyan-400">Final Year Engineering Project — Research Prototype</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
          >
            Explainable AI for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">
              Mitral Valve Prolapse
            </span>{' '}
            Screening
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-navy-400 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            An automated multimodal framework combining phonocardiogram and electrocardiogram signals with clinically interpretable AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary flex items-center gap-2 text-base px-8 py-3"
            >
              Start Analysis <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/methodology')}
              className="btn-secondary flex items-center gap-2 text-base px-8 py-3"
            >
              <BookOpen className="w-4 h-4" /> Explore Methodology
            </button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.6 }}
                className="card p-4 text-center"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/15 flex items-center justify-center mb-2">
                  <f.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-sm font-medium text-navy-200">{f.label}</p>
                <p className="text-[10px] text-navy-500 mt-0.5">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-navy-800/50 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-cyan-500" />
            <span className="text-xs text-navy-500">CardioMVP AI — Explainable Cardiac Screening</span>
          </div>
          <p className="text-[10px] text-navy-600">
            YCCE Nagpur • Dept. of Information Technology • Research Prototype
          </p>
        </div>
      </footer>
    </div>
  )
}
