import { clearSession } from '../utils/auth'

interface DashboardProps {
  userName: string
  onSignOut: () => void
}

export const Dashboard = ({ userName, onSignOut }: DashboardProps) => {
  const handleSignOut = () => {
    clearSession()
    onSignOut()
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Dashboard</h2>
      <div className="text-center">
        <p className="text-lg mb-4">
          Hello, <span className="font-semibold">{userName}</span>
        </p>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
