import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { HelpClient } from './client'

export default async function HelpPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return <HelpClient />
}
