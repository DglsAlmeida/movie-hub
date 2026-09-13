import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('renders all form fields', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(await screen.findByText('Password is required')).toBeInTheDocument()
  })

  it('shows error for invalid credentials', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
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

  it('navigates to home after successful login', async () => {
    sessionStorage.setItem(
      'auth_users',
      JSON.stringify([
        { name: 'John', email: 'john@test.com', password: 'pass123' },
      ]),
    )
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Routes>
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>,
    )
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'john@test.com' },
    })
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'pass123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/home/i)).toBeInTheDocument()
    })
  })

  it('has a link to signup page', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })
})
