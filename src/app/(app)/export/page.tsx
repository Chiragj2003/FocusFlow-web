'use client'

import { useState } from 'react'
import { Download, FileText, FileImage } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ExportPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.set('start', startDate)
      if (endDate) params.set('end', endDate)

      const response = await fetch(`/api/exports/csv?${params.toString()}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `habits-export-${startDate || 'all'}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPdf = async () => {
    setIsExportingPdf(true)
    try {
      const response = await fetch('/api/exports/insights')
      
      if (response.ok) {
        const data = await response.json()
        generateInsightsPdf(data)
      }
    } catch (error) {
      console.error('PDF Export failed:', error)
    } finally {
      setIsExportingPdf(false)
    }
  }

  const generateInsightsPdf = (data: {
    monthName: string
    insights: {
      totalCompleted: number
      totalPossible: number
      overallCompletionRate: number
      weekly: { weekStart: string; completed: number; possible: number; completionRate: number }[]
      topHabits: { title: string; completionRate: number; currentStreak: number; longestStreak: number }[]
      habitSummaries: { title: string; countLogged: number; sumValue: number; avgPerActiveDay: number }[]
    }
    streaks: { title: string; currentStreak: number; longestStreak: number }[]
    habits: { title: string }[]
  }) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPos = 20

    // Title
    doc.setFontSize(24)
    doc.setTextColor(255, 180, 162) // Primary color
    doc.text('FocusFlow', 20, yPos)
    
    doc.setFontSize(16)
    doc.setTextColor(100)
    doc.text('Insights Report', 20, yPos + 10)
    
    doc.setFontSize(12)
    doc.setTextColor(150)
    doc.text(data.monthName, 20, yPos + 18)
    
    yPos += 35

    // Overview Section
    doc.setFontSize(14)
    doc.setTextColor(50)
    doc.text('Monthly Overview', 20, yPos)
    yPos += 10

    const completionRate = Math.round(data.insights.overallCompletionRate * 100)
    
    // Stats boxes
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(20, yPos, 50, 25, 3, 3, 'F')
    doc.roundedRect(80, yPos, 50, 25, 3, 3, 'F')
    doc.roundedRect(140, yPos, 50, 25, 3, 3, 'F')

    doc.setFontSize(18)
    doc.setTextColor(50)
    doc.text(String(data.insights.totalCompleted), 30, yPos + 12)
    doc.text(String(data.insights.totalPossible), 90, yPos + 12)
    doc.text(`${completionRate}%`, 150, yPos + 12)

    doc.setFontSize(8)
    doc.setTextColor(120)
    doc.text('Completed', 30, yPos + 20)
    doc.text('Total Possible', 90, yPos + 20)
    doc.text('Completion Rate', 150, yPos + 20)

    yPos += 35

    // Weekly Performance
    doc.setFontSize(14)
    doc.setTextColor(50)
    doc.text('Weekly Performance', 20, yPos)
    yPos += 8

    if (data.insights.weekly.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Week', 'Completed', 'Possible', 'Rate']],
        body: data.insights.weekly.map((week, index) => [
          `Week ${index + 1}`,
          week.completed,
          week.possible,
          `${Math.round(week.completionRate * 100)}%`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [255, 180, 162] },
        margin: { left: 20, right: 20 },
      })
      yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15
    }

    // Top Habits
    if (data.insights.topHabits.length > 0) {
      doc.setFontSize(14)
      doc.setTextColor(50)
      doc.text('Top Performing Habits', 20, yPos)
      yPos += 8

      autoTable(doc, {
        startY: yPos,
        head: [['Habit', 'Completion Rate', 'Current Streak', 'Longest Streak']],
        body: data.insights.topHabits.slice(0, 10).map(habit => [
          habit.title,
          `${Math.round(habit.completionRate * 100)}%`,
          `${habit.currentStreak} days`,
          `${habit.longestStreak} days`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [255, 180, 162] },
        margin: { left: 20, right: 20 },
      })
      yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15
    }

    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    // Habit Details
    if (data.insights.habitSummaries.length > 0) {
      doc.setFontSize(14)
      doc.setTextColor(50)
      doc.text('Habit Details', 20, yPos)
      yPos += 8

      autoTable(doc, {
        startY: yPos,
        head: [['Habit', 'Days Logged', 'Total Value', 'Avg/Day']],
        body: data.insights.habitSummaries.map(summary => [
          summary.title,
          summary.countLogged,
          summary.sumValue > 0 ? summary.sumValue.toFixed(0) : '-',
          summary.avgPerActiveDay > 0 ? summary.avgPerActiveDay.toFixed(1) : '-'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [255, 180, 162] },
        margin: { left: 20, right: 20 },
      })
    }

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} - FocusFlow`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }

    // Download
    doc.save(`focusflow-insights-${data.monthName.replace(' ', '-').toLowerCase()}.pdf`)
  }

  const setThisMonth = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }

  const setLastMonth = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const end = new Date(now.getFullYear(), now.getMonth(), 0)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }

  const setThisYear = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const end = new Date(now.getFullYear(), 11, 31)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Export Data</h1>
        <p className="text-muted-foreground mt-1">
          Download your habit tracking data in various formats
        </p>
      </div>

      {/* PDF Insights Export Card */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-500">
            <FileImage size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Insights PDF Report</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Download a beautiful PDF report of your monthly insights including
              charts, streaks, and habit performance.
            </p>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportPdf}
          disabled={isExportingPdf}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExportingPdf ? (
            <>
              <span className="animate-spin">⏳</span>
              Generating PDF...
            </>
          ) : (
            <>
              <Download size={18} />
              Download Insights PDF
            </>
          )}
        </button>
      </div>

      {/* CSV Export Card */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">CSV Export</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Export your habit entries including dates, completion status,
              values, and notes.
            </p>
          </div>
        </div>

        {/* Quick Date Selectors */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Quick Select
          </label>
          <div className="flex gap-2">
            <button
              onClick={setThisMonth}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-border transition-colors"
            >
              This Month
            </button>
            <button
              onClick={setLastMonth}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-border transition-colors"
            >
              Last Month
            </button>
            <button
              onClick={setThisYear}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-border transition-colors"
            >
              This Year
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-card-foreground"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-card-foreground"
              />
            </div>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <span className="animate-spin">⏳</span>
              Exporting...
            </>
          ) : (
            <>
              <Download size={18} />
              Download CSV
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
          What&apos;s included in the export?
        </h3>
        <ul className="text-sm text-blue-600/80 dark:text-blue-400/80 space-y-1">
          <li>• Date of each habit entry</li>
          <li>• Habit name and category</li>
          <li>• Completion status (Yes/No)</li>
          <li>• Numeric values (for duration/quantity habits)</li>
          <li>• Notes you&apos;ve added</li>
        </ul>
      </div>
    </div>
  )
}
