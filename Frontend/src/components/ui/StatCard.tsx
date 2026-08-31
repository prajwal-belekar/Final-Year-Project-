import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: string; positive: boolean }
  color?: 'cyan' | 'green' | 'red' | 'amber' | 'blue'
  className?: string
}

const colorMap = {
  cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
  green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
  red: 'from-red-500/20 to-red-600/5 border-red-500/20 text-red-400',
  amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400',
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
}

const iconColorMap = {
  cyan: 'bg-cyan-500/15 text-cyan-400',
  green: 'bg-emerald-500/15 text-emerald-400',
  red: 'bg-red-500/15 text-red-400',
  amber: 'bg-amber-500/15 text-amber-400',
  blue: 'bg-blue-500/15 text-blue-400',
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'cyan', className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('card p-5 relative overflow-hidden', className)}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', colorMap[color])} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconColorMap[color])}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <span className={cn('text-xs font-medium', trend.positive ? 'text-emerald-400' : 'text-red-400')}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        <p className="text-sm text-navy-400 mb-1">{title}</p>
        <p className="stat-value text-white">{value}</p>
        {subtitle && <p className="text-xs text-navy-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  )
}
