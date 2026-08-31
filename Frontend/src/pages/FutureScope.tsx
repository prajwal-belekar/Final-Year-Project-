import { motion } from 'framer-motion'
import { Smartphone, Users, Database, Brain, Activity, Shield, ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils'

const stages = [
  {
    num: '01',
    icon: Smartphone,
    title: 'Wearable Integration',
    desc: 'Digital stethoscopes and single-lead ECG patches for continuous monitoring and screening outside clinical settings.',
    color: 'cyan',
  },
  {
    num: '02',
    icon: Users,
    title: 'Multi-centre Clinical Validation',
    desc: 'Validation against echocardiographic gold-standard findings across multiple clinical sites and populations.',
    color: 'green',
  },
  {
    num: '03',
    icon: Database,
    title: 'Dataset Expansion',
    desc: 'Larger and more diverse MVP-specific datasets to improve model generalizability and reduce bias.',
    color: 'blue',
  },
  {
    num: '04',
    icon: Brain,
    title: 'Hybrid Deep Learning',
    desc: 'CNN + Transformer / Vision Transformer exploration for improved feature extraction and temporal modeling.',
    color: 'amber',
  },
  {
    num: '05',
    icon: Activity,
    title: 'Longitudinal Monitoring',
    desc: 'Tracking MVP progression over time with repeated screening and trend analysis.',
    color: 'cyan',
  },
  {
    num: '06',
    icon: Shield,
    title: 'Regulatory Compliance',
    desc: 'Future CE Mark and CDSCO clearance pathway for clinical deployment as a medical device.',
    color: 'red',
  },
]

const colorMap: Record<string, { bg: string; border: string; icon: string; num: string }> = {
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: 'text-cyan-400', num: 'text-cyan-500' },
  green: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', num: 'text-emerald-500' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400', num: 'text-blue-500' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-400', num: 'text-amber-500' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-400', num: 'text-red-500' },
}

export default function FutureScope() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Future Scope</h1>
        <p className="text-sm text-navy-400 mt-1">Planned enhancements and research directions.</p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-navy-700/30 to-transparent hidden sm:block" />

        <div className="space-y-4">
          {stages.map((stage, i) => {
            const c = colorMap[stage.color]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative sm:pl-16"
              >
                {/* Timeline dot */}
                <div className={cn('absolute left-3 top-5 w-6 h-6 rounded-full border-2 items-center justify-center hidden sm:flex', c.border, c.bg)}>
                  <div className={cn('w-2 h-2 rounded-full', c.icon.replace('text-', 'bg-'))} />
                </div>

                <div className={cn('card p-5 border', c.border)}>
                  <div className="flex items-start gap-4">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', c.bg)}>
                      <stage.icon className={cn('w-5 h-5', c.icon)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('text-xs font-bold', c.num)}>Stage {stage.num}</span>
                        <ArrowRight className="w-3 h-3 text-navy-600" />
                        <h3 className="text-sm font-bold text-white">{stage.title}</h3>
                      </div>
                      <p className="text-xs text-navy-400 leading-relaxed">{stage.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
