'use client'

import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface CategoryData {
  category: string
  completionRate: number
  totalEntries: number
}

interface CategoryRadarProps {
  data: CategoryData[]
  size?: number
}

export function CategoryRadar({ data, size = 280 }: CategoryRadarProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-zinc-500 text-sm"
        style={{ height: size }}
      >
        No category data available
      </div>
    )
  }

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        label: 'Completion Rate',
        data: data.map((d) => d.completionRate),
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#09090b',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const options: ChartOptions<'radar'> = {
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
        callbacks: {
          label: function (context) {
            const idx = context.dataIndex
            const item = data[idx]
            return [
              `Completion: ${Math.round(item.completionRate)}%`,
              `Entries: ${item.totalEntries}`,
            ]
          },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        angleLines: {
          color: '#27272a',
        },
        grid: {
          color: '#27272a',
        },
        pointLabels: {
          color: '#a1a1aa',
          font: {
            size: 11,
          },
        },
        ticks: {
          color: '#71717a',
          backdropColor: 'transparent',
          font: {
            size: 10,
          },
          stepSize: 25,
          callback: function (value) {
            return `${value}%`
          },
        },
      },
    },
  }

  return (
    <div style={{ width: size, height: size }} className="mx-auto">
      <Radar data={chartData} options={options} />
    </div>
  )
}
