import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateCSVExport } from '@/lib/analytics'

// GET /api/exports/csv - Export data as CSV
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    // Default to current month if no dates provided
    const now = new Date()
    const startDate = start
      ? new Date(start)
      : new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = end
      ? new Date(end)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const csv = await generateCSVExport(userId, startDate, endDate)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="habits-export-${start || 'month'}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error generating CSV:', error)
    return NextResponse.json(
      { error: 'Failed to generate export' },
      { status: 500 }
    )
  }
}
