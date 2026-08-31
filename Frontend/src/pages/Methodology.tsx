import { motion } from 'framer-motion'
import { AlertTriangle, Lightbulb, Waves, Activity, Cpu, ArrowRight } from 'lucide-react'

const PipelineStep = ({ label, delay = 0 }: { label: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="px-4 py-2.5 rounded-xl bg-navy-800/50 border border-navy-700/30 text-sm text-navy-200 font-medium text-center"
  >
    {label}
  </motion.div>
)

const Arrow = () => (
  <div className="flex justify-center py-1">
    <ArrowRight className="w-4 h-4 text-navy-600 rotate-90 sm:rotate-0" />
  </div>
)

export default function Methodology() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Methodology</h1>
        <p className="text-sm text-navy-400 mt-1">Research approach and technical methodology.</p>
      </motion.div>

      {/* Problem */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h2 className="section-title">Problem Statement</h2>
        </div>
        <p className="text-sm text-navy-300 leading-relaxed">
          Mitral Valve Prolapse (MVP) can be difficult to detect using conventional auscultation methods, particularly in resource-limited
          environments where specialist access and echocardiography equipment may be unavailable. Early and accurate screening is important
          for identifying patients who may require further clinical evaluation.
        </p>
      </motion.div>

      {/* Proposed Solution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-cyan-400" />
          <h2 className="section-title">Proposed Solution</h2>
        </div>
        <p className="text-sm text-navy-300 leading-relaxed">
          An automated multimodal analysis framework combining Phonocardiogram (PCG) and Electrocardiogram (ECG) signals with
          backend inference. The system uses age-based intelligent routing to select the appropriate model pathway,
          returning the screening diagnosis, probability, threshold, and recommendation.
        </p>
      </motion.div>

      {/* PCG Processing */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Waves className="w-4 h-4 text-cyan-400" />
          <h2 className="section-title">PCG Signal Processing</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['PCG Audio (.wav)', '20–500 Hz Bandpass', 'Normalization', '5s Segmentation', 'CWT (cmor1.5-1.0)', '224×224 RGB Scalogram'].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <PipelineStep label={step} delay={i * 0.1} />
              {i < 5 && <Arrow />}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-navy-800/30 rounded-xl">
          <p className="text-xs text-navy-400">
            <span className="font-medium text-navy-300">CWT Parameters:</span> Complex Morlet wavelet (cmor1.5-1.0), producing time-frequency
            representations that capture both S1/S2 heart sounds and any mid-systolic clicks or late-systolic murmurs characteristic of MVP.
          </p>
        </div>
      </motion.div>

      {/* ECG Processing */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h2 className="section-title">ECG Signal Processing</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['ECG Data (.hea or .npy)', 'Resize to 224×224', 'Normalization'].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <PipelineStep label={step} delay={i * 0.1} />
              {i < 2 && <Arrow />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Model Architecture */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h2 className="section-title">Model Architecture</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-navy-800/30 border border-cyan-500/10">
            <h3 className="text-sm font-semibold text-cyan-300 mb-2">Adult Multimodal</h3>
            <p className="text-xs text-navy-400 mb-3">CNN + CNN → Feature Fusion → Classification</p>
            <div className="space-y-1.5">
              {['PCG CNN Feature Stream', 'ECG CNN Feature Stream', 'Dense Feature Fusion Layer', 'Sigmoid Binary Classifier'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-xs text-navy-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-navy-800/30 border border-amber-500/10">
            <h3 className="text-sm font-semibold text-amber-300 mb-2">Paediatric MobileNetV2</h3>
            <p className="text-xs text-navy-400 mb-3">MobileNetV2 Transfer Learning → Classification</p>
            <div className="space-y-1.5">
              {['MobileNetV2 Backbone (pretrained)', 'Global Average Pooling', 'Dense 128 + Dropout', 'Sigmoid Binary Classifier'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-xs text-navy-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  )
}
