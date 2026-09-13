import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SignupForm } from './SignupForm'

describe('SignupForm', () => {
  const mockOnSuccess = vi.fn()
  const mockOnSwitchToLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('renders all form fields', () => {
    render(
      <SignupForm
        onSuccess={mockOnSuccess}
        onSwitchToLogin={mockOnSwitchToLogin}
      />,
    )
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(
      <SignupForm
        onSuccess={mockOnSuccess}
        onSwitchToLogin={mockOnSwitchToLogin}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(await screen.findByText('Password is required')).toBeInTheDocument()
  })

  it('shows password length error', async () => {
    render(
      <SignupForm
        onSuccess={mockOnSuccess}
        onSwitchToLogin={mockOnSwitchToLogin}
      />,
    )
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: '123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(
      await screen.findByText('Password must be at least 6 characters'),
    ).toBeInTheDocument()
  })

  it('shows error for duplicate email', async () => {
    sessionStorage.setItem(
      'auth_users',
      JSON.stringify([
        { name: 'John', email: 'john@test.com', password: 'pass123' },
      ]),
    )
    render(
      <SignupForm
        onSuccess={mockOnSuccess}
        onSwitchToLogin={mockOnSwitchToLogin}
      />,
    )
    fireEvent.input(screen.getByLabelText(/name/i), {
      target: { value: 'Jane' },
    })
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'john@test.com' },
    })
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'pass123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(await screen.findByText('Email already exists')).toBeInTheDocument()
  })

  it('calls onSuccess after successful signup', async () => {
    render(
      <SignupForm
        onSuccess={mockOnSuccess}
        onSwitchToLogin={mockOnSwitchToLogin}
      />,
    )
    fireEvent.input(screen.getByLabelText(/name/i), {
      target: { value: 'John' },
    })
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'john@test.com' },
    })
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'pass123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('switches to login view when sign in is clicked', () => {
    render(
      <SignupForm
        onSuccess={mockOnSuccess}
        onSwitchToLogin={mockOnSwitchToLogin}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(mockOnSwitchToLogin).toHaveBeenCalled()
  })
})
