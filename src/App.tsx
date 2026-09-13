import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { getSession, type Session } from './utils/auth'
import { SignupForm } from './components/SignupForm'
import { LoginForm } from './components/LoginForm'
import { Dashboard } from './components/Dashboard'
import { HomePage } from './features/movies/pages/HomePage'
import { SearchPage } from './features/movies/pages/SearchPage'

const queryClient = new QueryClient()

type View = 'signup' | 'login' | 'dashboard'

const AuthApp = () => {
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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/auth" element={<AuthApp />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
