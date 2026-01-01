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

interface TrendChartProps {
  data: {
    date: string
    value: number
  }[]
  height?: number
  gradient?: boolean
  showPoints?: boolean
}

export function TrendChart({
  data,
  height = 250,
  gradient = true,
  showPoints = true,
}: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-zinc-500 text-sm"
        style={{ height }}
      >
        No trend data available
      </div>
    )
  }

  const labels = data.map((d) => {
    const date = new Date(d.date)
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
  })

  // Calculate moving average for trend line
  const calculateMovingAverage = (values: number[], window: number) => {
    return values.map((_, idx, arr) => {
      const start = Math.max(0, idx - window + 1)
      const slice = arr.slice(start, idx + 1)
      return slice.reduce((a, b) => a + b, 0) / slice.length
    })
  }

  const values = data.map((d) => d.value)
  const trendLine = calculateMovingAverage(values, 7)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Daily',
        data: values,
        borderColor: '#8b5cf6',
        backgroundColor: gradient
          ? 'rgba(139, 92, 246, 0.1)'
          : 'transparent',
        fill: gradient,
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#09090b',
        pointBorderWidth: 2,
        pointRadius: showPoints ? 4 : 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: '7-day Average',
        data: trendLine,
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: '#a1a1aa',
          boxWidth: 12,
          padding: 16,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#fafafa',
        bodyColor: '#a1a1aa',
        borderColor: '#27272a',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          title: function (context) {
            const idx = context[0]?.dataIndex ?? 0
            return new Date(data[idx].date).toLocaleDateString('en', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })
          },
          label: function (context) {
            const label = context.dataset.label || ''
            const value = Math.round(context.raw as number)
            return `${label}: ${value}%`
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
          color: '#71717a',
          font: {
            size: 11,
          },
          maxTicksLimit: 7,
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
          color: '#27272a',
        },
        ticks: {
          color: '#71717a',
          font: {
            size: 11,
          },
          callback: function (value) {
            return `${value}%`
          },
          stepSize: 25,
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
