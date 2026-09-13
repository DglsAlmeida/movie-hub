import { useState, useEffect } from 'react'
import { getSession, type Session } from './utils/auth'
import { SignupForm } from './components/SignupForm'
import { LoginForm } from './components/LoginForm'
import { Dashboard } from './components/Dashboard'

type View = 'signup' | 'login' | 'dashboard'

function App() {
  const [view, setView] = useState<View>('signup')
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const existingSession = getSession()
    if (existingSession) {
      setSession(existingSession)
      setView('dashboard')
    }
  }, [])

  function handleSignupSuccess() {
    setView('login')
  }

  function handleLoginSuccess() {
    const currentSession = getSession()
    setSession(currentSession)
    setView('dashboard')
  }

  function handleSignOut() {
    setSession(null)
    setView('login')
  }

  if (view === 'dashboard' && session) {
    return <Dashboard userName={session.name} onSignOut={handleSignOut} />
  }

  if (view === 'login') {
    return (
      <LoginForm
        onSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setView('signup')}
      />
    )
  }

  return (
    <SignupForm
      onSuccess={handleSignupSuccess}
      onSwitchToLogin={() => setView('login')}
    />
  )
}

export default App
