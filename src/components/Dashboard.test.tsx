import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Dashboard } from './Dashboard'

describe('Dashboard', () => {
  const mockOnSignOut = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('displays greeting with user name', () => {
    render(<Dashboard userName="John" onSignOut={mockOnSignOut} />)
    expect(screen.getByText(/hello/i)).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('displays sign out button', () => {
    render(<Dashboard userName="John" onSignOut={mockOnSignOut} />)
    expect(
      screen.getByRole('button', { name: /sign out/i }),
    ).toBeInTheDocument()
  })

  it('calls onSignOut when sign out is clicked', () => {
    render(<Dashboard userName="John" onSignOut={mockOnSignOut} />)
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    expect(mockOnSignOut).toHaveBeenCalled()
  })

  it('clears session when sign out is clicked', () => {
    sessionStorage.setItem(
      'auth_session',
      JSON.stringify({ name: 'John', email: 'john@test.com' }),
    )
    render(<Dashboard userName="John" onSignOut={mockOnSignOut} />)
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    expect(sessionStorage.getItem('auth_session')).toBeNull()
  })
})
