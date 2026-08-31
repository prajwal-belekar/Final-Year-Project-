import { motion } from 'framer-motion'
import { Heart, Activity, Split, Shield } from 'lucide-react'

export default function Dataset() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Dataset & Experimental Setup</h1>
        <p className="text-sm text-navy-400 mt-1">Data sources, preprocessing, and experimental configuration.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PCG Dataset */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <Heart className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">PCG Dataset</h2>
              <p className="text-xs text-navy-400">Phonocardiogram recordings</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Source', value: 'PhysioNet/CinC 2016 + In-house' },
              { label: 'Total Samples', value: '680 MVP + Normal' },
              { label: 'Format', value: '.wav' },
              { label: 'Sampling Rate', value: '44.1 kHz' },
              { label: 'Segment Duration', value: '5 seconds' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-navy-800/30 rounded-lg">
                <span className="text-xs text-navy-400">{item.label}</span>
                <span className="text-sm font-medium text-navy-200">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ECG Dataset */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">ECG Dataset</h2>
              <p className="text-xs text-navy-400">Electrocardiogram signals</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Source', value: 'PTB-XL' },
              { label: 'Samples Used', value: '4,800 MVP + Normal' },
              { label: 'Format', value: '.hea or .npy for API upload' },
              { label: 'Sampling Rate', value: '500 Hz' },
              { label: 'Preprocessing', value: '50 Hz Notch + 0.5–40 Hz Bandpass' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-navy-800/30 rounded-lg">
                <span className="text-xs text-navy-400">{item.label}</span>
                <span className="text-sm font-medium text-navy-200">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Data Split */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Split className="w-4 h-4 text-cyan-400" />
          <h2 className="section-title">Data Split & Validation</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-navy-800/30 text-center">
            <p className="text-3xl font-bold text-cyan-400">80%</p>
            <p className="text-xs text-navy-400 mt-1">Training Set</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-800/30 text-center">
            <p className="text-3xl font-bold text-amber-400">20%</p>
            <p className="text-xs text-navy-400 mt-1">Testing Set</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-800/30 text-center">
            <p className="text-3xl font-bold text-emerald-400">3-Fold</p>
            <p className="text-xs text-navy-400 mt-1">Cross Validation</p>
          </div>
        </div>
      </motion.div>

      {/* Data Augmentation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h2 className="section-title">Data Quality</h2>
        </div>
        <p className="text-sm text-navy-300 leading-relaxed">
          All PCG recordings were preprocessed with band-pass filtering (20–500 Hz) to remove noise outside the cardiac frequency range.
          ECG signals underwent 50 Hz notch filtering to eliminate powerline interference and 0.5–40 Hz band-pass filtering to isolate
          clinically relevant cardiac electrical activity. Signals were segmented into consistent 5-second windows for uniform model input.
        </p>
      </motion.div>
    </div>
  )
}
