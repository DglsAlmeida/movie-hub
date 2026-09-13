import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Dashboard } from './Dashboard'

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('displays greeting with user name', () => {
    render(
      <MemoryRouter>
        <Dashboard userName="John" />
      </MemoryRouter>,
    )
    expect(screen.getByText(/hello/i)).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('displays sign out button', () => {
    render(
      <MemoryRouter>
        <Dashboard userName="John" />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('button', { name: /sign out/i }),
    ).toBeInTheDocument()
  })

  it('clears session when sign out is clicked', () => {
    sessionStorage.setItem(
      'auth_session',
      JSON.stringify({ name: 'John', email: 'john@test.com' }),
    )
    render(
      <MemoryRouter>
        <Dashboard userName="John" />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    expect(sessionStorage.getItem('auth_session')).toBeNull()
  })

  it('navigates to login after sign out', () => {
    render(
      <MemoryRouter initialEntries={['/auth/dashboard']}>
        <Dashboard userName="John" />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    expect(sessionStorage.getItem('auth_session')).toBeNull()
  })
})
