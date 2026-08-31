import { AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface DisclaimerProps {
  variant?: 'default' | 'compact' | 'inline'
  className?: string
}

export default function Disclaimer({ variant = 'default', className }: DisclaimerProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10', className)}>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-300/80 leading-relaxed">
          AI-assisted screening result. Does not replace echocardiography or professional diagnosis.
        </p>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <p className={cn('text-[11px] text-navy-500 italic', className)}>
        Research & Screening Prototype — Results support clinical assessment and do not replace professional medical evaluation.
      </p>
    )
  }

  return (
    <div className={cn('card p-4 border-amber-500/15 bg-amber-500/5', className)}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-amber-300 mb-1">Research & Screening Prototype</h4>
          <p className="text-xs text-navy-400 leading-relaxed">
            This application provides AI-assisted screening information based on PCG and ECG signals. Results are not a definitive medical diagnosis
            and should not replace professional clinical evaluation or echocardiography. Further clinical evaluation may be appropriate based on screening results.
          </p>
        </div>
      </div>
    </div>
  )
}
