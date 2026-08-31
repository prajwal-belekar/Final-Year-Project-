import { motion } from 'framer-motion'
import { Server, Database, Cpu, Monitor, ArrowDown } from 'lucide-react'
import { cn } from '../lib/utils'

const ArchNode = ({ icon: Icon, title, items, color, delay = 0 }: { icon: any; title: string; items: string[]; color: string; delay?: number }) => {
  const colorMap: Record<string, { border: string; bg: string; icon: string; text: string }> = {
    cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', icon: 'text-cyan-400', text: 'text-cyan-300' },
    green: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', icon: 'text-emerald-400', text: 'text-emerald-300' },
    amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', icon: 'text-amber-400', text: 'text-amber-300' },
    blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', icon: 'text-blue-400', text: 'text-blue-300' },
    red: { border: 'border-red-500/30', bg: 'bg-red-500/10', icon: 'text-red-400', text: 'text-red-300' },
  }
  const c = colorMap[color] || colorMap.cyan

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn('card p-5 border', c.border)}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', c.bg)}>
          <Icon className={cn('w-4 h-4', c.icon)} />
        </div>
        <h3 className={cn('text-sm font-bold', c.text)}>{title}</h3>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn('w-1 h-1 rounded-full', c.icon.replace('text-', 'bg-'))} />
            <span className="text-xs text-navy-300">{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const ArrowDownIcon = ({ delay = 0 }: { delay?: number }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }} className="flex justify-center py-2">
    <ArrowDown className="w-5 h-5 text-navy-600" />
  </motion.div>
)

export default function Architecture() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">System Architecture</h1>
        <p className="text-sm text-navy-400 mt-1">End-to-end system design and technology stack.</p>
      </motion.div>

      {/* Architecture Flow */}
      <div className="space-y-0">
        {/* Input Layer */}
        <ArchNode
          icon={Database}
          title="Input Layer"
          items={['PCG Audio Recording (.wav)', 'ECG Signal Data (.hea or .npy) for adults', 'Patient Age']}
          color="cyan"
          delay={0}
        />
        <ArrowDownIcon delay={0.1} />

        {/* Preprocessing */}
        <ArchNode
          icon={Server}
          title="Preprocessing Layer"
          items={[
            'PCG: 20–500 Hz Bandpass → Normalization → 5s Segmentation → CWT (cmor1.5-1.0)',
            'ECG: 50 Hz Notch → 0.5–40 Hz Bandpass → Normalization → 224×224 Matrix',
          ]}
          color="green"
          delay={0.2}
        />
        <ArrowDownIcon delay={0.3} />

        {/* Router */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="card p-5 border-2 border-amber-500/30 bg-amber-500/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-amber-300">Intelligent Router — FastAPI Age-Based Routing</h3>
          </div>
          <p className="text-xs text-navy-400">Age ≥ 18 → Adult Multimodal | Age &lt; 18 → Paediatric MobileNetV2</p>
        </motion.div>
        <ArrowDownIcon delay={0.5} />

        {/* Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArchNode
            icon={Cpu}
            title="Branch A: Adult Multimodal"
            items={['PCG CNN Feature Stream', 'ECG CNN Feature Stream', 'Dense Feature Fusion', 'Sigmoid Classifier (0.65 threshold)']}
            color="cyan"
            delay={0.6}
          />
          <ArchNode
            icon={Cpu}
            title="Branch B: Paediatric MobileNetV2"
            items={['PCG Scalogram Input', 'MobileNetV2 Transfer Learning', 'Sigmoid Classifier (0.60 threshold)']}
            color="amber"
            delay={0.6}
          />
        </div>
        <ArrowDownIcon delay={0.7} />

        {/* Classification */}
        <ArchNode
          icon={Server}
          title="Classification Output"
          items={['Diagnosis', 'Abnormality Probability', 'Decision Threshold', 'Recommendation']}
          color="red"
          delay={0.8}
        />
        <ArrowDownIcon delay={0.9} />

        {/* Frontend */}
        <ArchNode
          icon={Monitor}
          title="Frontend Presentation"
          items={['Diagnosis', 'Abnormality Probability', 'Decision Threshold', 'Architecture & Recommendation']}
          color="green"
          delay={1.0}
        />
      </div>

      {/* Tech Stack */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="card p-6">
        <h2 className="section-title mb-4">Technology Stack</h2>
        <div className="flex flex-wrap gap-2">
          {['Python', 'TensorFlow', 'Keras', 'Librosa', 'PyWavelets', 'OpenCV', 'NumPy', 'Scikit-learn', 'FastAPI', 'Uvicorn', 'Docker', 'React', 'TypeScript', 'Tailwind CSS'].map(tech => (
            <span key={tech} className="px-3 py-1.5 rounded-lg bg-navy-800/50 border border-navy-700/30 text-xs font-medium text-navy-300">
              {tech}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
