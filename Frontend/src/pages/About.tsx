import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, Heart } from 'lucide-react'

export default function About() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">About Project</h1>
        <p className="text-sm text-navy-400 mt-1">Research project information and team.</p>
      </motion.div>

      {/* Project Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 border-cyan-500/20 border">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-snug">
              Automated and Clinically Explainable Multimodal Framework for Mitral Valve Prolapse Detection using ECG and PCG Signals
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="badge-info">Final Year Project</span>
              <span className="badge-info">Research Prototype</span>
              <span className="badge-info">AI Healthcare</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Institution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-4 h-4 text-cyan-400" />
          <h2 className="section-title">Institution</h2>
        </div>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-navy-800/30">
            <h3 className="text-base font-bold text-white mb-1">Yeshwantrao Chavan College of Engineering, Nagpur</h3>
            <p className="text-sm text-navy-400">Department of Information Technology</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-navy-800/30 rounded-xl">
              <p className="text-xs text-navy-500 mb-1">Project Guide</p>
              <p className="text-sm font-medium text-navy-200">Prof. Jagdish Yadav</p>
            </div>
            <div className="p-3 bg-navy-800/30 rounded-xl">
              <p className="text-xs text-navy-500 mb-1">Project Co-guide</p>
              <p className="text-sm font-medium text-navy-200">Dr. Sanjay Gadekar</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Abstract */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h2 className="section-title">Abstract</h2>
        </div>
        <p className="text-sm text-navy-300 leading-relaxed">
          This project presents an automated and clinically explainable multimodal framework for detecting Mitral Valve Prolapse (MVP)
          using Phonocardiogram (PCG) and Electrocardiogram (ECG) signals. The system employs age-based intelligent routing to select
          between an adult multimodal model (combining PCG and ECG features through dense fusion) and a paediatric MobileNetV2
          transfer-learning model (using PCG scalograms alone). Continuous Wavelet Transform (CWT) using the Complex Morlet wavelet
          converts PCG signals into model-ready representations for deep learning analysis. The backend returns a diagnosis,
          abnormality probability, decision threshold, model route, and clinical recommendation.
        </p>
      </motion.div>

      {/* Disclaimer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5 border-amber-500/15 bg-amber-500/5">
        <p className="text-xs text-navy-400 text-center">
          This is a research/final-year project prototype. It is not a certified medical device and should not be used for clinical diagnosis.
        </p>
      </motion.div>
    </div>
  )
}
