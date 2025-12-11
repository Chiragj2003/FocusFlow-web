'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface WeeklyBarsProps {
  data: {
    weekStart: string
    completed: number
    possible: number
    completionRate: number
  }[]
  color?: string
  height?: number
}

export function WeeklyBars({
  data,
  color = '#FFB4A2',
  height = 180,
}: WeeklyBarsProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground text-sm"
        style={{ height }}
      >
        No weekly data
      </div>
    )
  }

  const chartData = {
    labels: data.map((_, index) => `W${index + 1}`),
    datasets: [
      {
        label: 'Completion Rate',
        data: data.map((week) => Math.round(week.completionRate * 100)),
        backgroundColor: data.map(
          (week) => {
            const opacity = 0.7 + (week.completionRate * 0.3)
            // Convert hex to rgba
            const hex = color.replace('#', '')
            const r = parseInt(hex.substring(0, 2), 16)
            const g = parseInt(hex.substring(2, 4), 16)
            const b = parseInt(hex.substring(4, 6), 16)
            return `rgba(${r}, ${g}, ${b}, ${opacity})`
          }
        ),
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 40,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#111827',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(context) {
            const idx = context[0]?.dataIndex ?? 0
            return `Week ${idx + 1}`
          },
          afterTitle: function(context) {
            const idx = context[0]?.dataIndex ?? 0
            const week = data[idx]
            return `${week.completed} / ${week.possible} completed`
          },
          label: function(context) {
            return `${context.raw}%`
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
          display: true,
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
      <Bar data={chartData} options={options} />
    </div>
  )
}
