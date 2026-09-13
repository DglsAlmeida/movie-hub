import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession } from '@/utils/auth'
import { LoginForm } from '../components/LoginForm'

export const SignInPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const session = getSession()
    if (session) {
      navigate('/auth/dashboard', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  )
}
