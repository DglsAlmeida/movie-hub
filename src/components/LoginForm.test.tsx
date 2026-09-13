import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  const mockOnSuccess = vi.fn()
  const mockOnSwitchToSignup = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('renders all form fields', () => {
    render(
      <LoginForm
        onSuccess={mockOnSuccess}
        onSwitchToSignup={mockOnSwitchToSignup}
      />,
    )
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(
      <LoginForm
        onSuccess={mockOnSuccess}
        onSwitchToSignup={mockOnSwitchToSignup}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(await screen.findByText('Password is required')).toBeInTheDocument()
  })

  it('shows error for invalid credentials', async () => {
    render(
      <LoginForm
        onSuccess={mockOnSuccess}
        onSwitchToSignup={mockOnSwitchToSignup}
      />,
    )
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'nonexistent@test.com' },
    })
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'pass123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(
      await screen.findByText('Invalid email or password'),
    ).toBeInTheDocument()
  })

  it('calls onSuccess after successful login', async () => {
    sessionStorage.setItem(
      'auth_users',
      JSON.stringify([
        { name: 'John', email: 'john@test.com', password: 'pass123' },
      ]),
    )
    render(
      <LoginForm
        onSuccess={mockOnSuccess}
        onSwitchToSignup={mockOnSwitchToSignup}
      />,
    )
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'john@test.com' },
    })
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'pass123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('switches to signup view when sign up is clicked', () => {
    render(
      <LoginForm
        onSuccess={mockOnSuccess}
        onSwitchToSignup={mockOnSwitchToSignup}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(mockOnSwitchToSignup).toHaveBeenCalled()
  })
})
