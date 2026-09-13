import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession } from '@/utils/auth'

export const useAuthRedirect = () => {
  const navigate = useNavigate()
  const session = getSession()

  useEffect(() => {
    if (session) {
      navigate('/', { replace: true })
    }
  }, [session, navigate])

  return session
}
