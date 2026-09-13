import { Navigate } from 'react-router-dom'
import { getSession } from '@/utils/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = getSession()

  if (!session) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}
