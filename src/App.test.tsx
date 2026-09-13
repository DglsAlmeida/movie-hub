import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('redirects to /auth/login when no session', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument()
  })

  it('renders protected content when session exists', () => {
    sessionStorage.setItem(
      'auth_session',
      JSON.stringify({ name: 'John', email: 'john@test.com' }),
    )
    render(<App />)
    expect(
      screen.queryByRole('heading', { name: /sign in/i }),
    ).not.toBeInTheDocument()
  })

  it('redirects /auth to login page', () => {
    window.history.pushState({}, '', '/auth')
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument()
  })
})
