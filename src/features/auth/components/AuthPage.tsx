import { useAuthRedirect } from '../hooks/useAuthRedirect'

interface AuthPageProps {
  children: React.ReactNode
}

export const AuthPage = ({ children }: AuthPageProps) => {
  const session = useAuthRedirect()

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {children}
    </div>
  )
}
