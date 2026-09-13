import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { ProtectedRoute } from './ProtectedRoute'

describe('ProtectedRoute', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders children when session exists', () => {
    sessionStorage.setItem(
      'auth_session',
      JSON.stringify({ name: 'John', email: 'john@test.com' }),
    )
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to /auth/login when no session', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to /auth/login when session is empty', () => {
    sessionStorage.setItem('auth_session', JSON.stringify(null))
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
