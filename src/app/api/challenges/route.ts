import { NextResponse } from 'next/server'
import { getCatalog, toApiChallenge } from '@/lib/challengeCatalog'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const catalog = await getCatalog()
    return NextResponse.json([...catalog.values()].filter((c) => c.active).map(toApiChallenge))
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
  }
}
