import { useNavigate } from 'react-router-dom'
import { clearSession } from '@/utils/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface DashboardProps {
  userName: string
}

export const Dashboard = ({ userName }: DashboardProps) => {
  const navigate = useNavigate()

  const handleSignOut = () => {
    clearSession()
    navigate('/auth/login')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Welcome back!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <p className="text-lg">
          Hello, <span className="font-semibold">{userName}</span>
        </p>
        <Button variant="destructive" onClick={handleSignOut}>
          Sign Out
        </Button>
      </CardContent>
    </Card>
  )
}
