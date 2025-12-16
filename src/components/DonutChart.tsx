'use client'

import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DonutChartProps {
  completed: number
  total: number
  size?: number
  showLabel?: boolean
  color?: string
}

export function DonutChart({
  completed,
  total,
  size = 180,
  showLabel = true,
  color = '#ffffff',
}: DonutChartProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const remaining = total - completed

  const data = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [completed, remaining],
        backgroundColor: [color, '#27272a'],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#fafafa',
        bodyColor: '#a1a1aa',
        borderColor: '#27272a',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        callbacks: {
          label: function(context) {
            return `${context.raw} days`
          },
        },
      },
    },
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Doughnut data={data} options={options} />
      
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-white">{percentage}%</span>
          <span className="text-sm text-zinc-400">Complete</span>
        </div>
      )}
    </div>
  )
}
