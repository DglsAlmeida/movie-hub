import { useEffect, useState } from 'react'
import { getSession, type Session } from '@/utils/auth'
import { Dashboard } from '../components/Dashboard'

export const DashboardPage = () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const existingSession = getSession()
    setSession(existingSession)
  }, [])

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Dashboard userName={session.name} />
    </div>
  )
}
