import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-black text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-zinc-300">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              'text-sm font-bold',
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            )}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
          <span className="text-sm text-zinc-500">vs last month</span>
        </div>
      )}
    </div>
  )
}
