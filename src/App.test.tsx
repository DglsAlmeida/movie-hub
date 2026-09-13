import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('MovieHub')).toBeInTheDocument()
  })

  it('renders search bar', () => {
    render(<App />)
    expect(screen.getByPlaceholderText(/search movies/i)).toBeInTheDocument()
  })

  it('redirects /auth to login page', () => {
    window.history.pushState({}, '', '/auth')
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /sign in/i })
    ).toBeInTheDocument()
  })
})
