'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

interface ChartLineProps {
  data: {
    date: string
    value: number
    label?: string
  }[]
  color?: string
  height?: number
  showGrid?: boolean
  showArea?: boolean
}

export function ChartLine({
  data,
  color = '#FFB4A2',
  height = 200,
  showGrid = true,
  showArea = true,
}: ChartLineProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground text-sm"
        style={{ height }}
      >
        No data to display
      </div>
    )
  }

  const labels = data.map((d) => {
    const date = new Date(d.date)
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
  })

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Completion',
        data: data.map((d) => d.value),
        borderColor: color,
        backgroundColor: showArea 
          ? `${color}4D` // 30% opacity
          : 'transparent',
        fill: showArea,
        tension: 0.4,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#6B7280',
        bodyColor: '#111827',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(context) {
            const idx = data.findIndex((_, i) => labels[i] === context[0]?.label)
            if (idx >= 0) {
              return new Date(data[idx].date).toLocaleDateString('en', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            }
            return context[0]?.label
          },
          label: function(context) {
            const value = context.raw as number
            return `${Math.round(value ?? 0)}% complete`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          display: showGrid,
          color: '#E5E7EB',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
          callback: function(value) {
            return `${value}%`
          },
        },
        border: {
          display: false,
        },
      },
    },
  }

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  )
}
