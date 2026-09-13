import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from './features/movies/pages/HomePage'
import { SearchPage } from './features/movies/pages/SearchPage'
import {
  SignUpPage,
  SignInPage,
  DashboardPage,
} from './features/auth'

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/login" element={<SignInPage />} />
          <Route path="/auth/dashboard" element={<DashboardPage />} />
          <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
