import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession, type Session } from '@/utils/auth'
import { Dashboard } from '../components/Dashboard'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const existingSession = getSession()
    if (!existingSession) {
      navigate('/auth/login', { replace: true })
      return
    }
    setSession(existingSession)
  }, [navigate])

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Dashboard userName={session.name} />
    </div>
  )
}
