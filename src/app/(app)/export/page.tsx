import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ExportClient } from './client'

export default async function ExportPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return <ExportClient />
}
