import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('shows signup form by default', () => {
    render(<App />)
    expect(screen.getByText(/create account/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('has link to switch to login form', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(
      screen.getByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument()
  })

  it('shows dashboard when user is authenticated', async () => {
    render(<App />)

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@test.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }))
    })

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@test.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }))
    })

    expect(screen.getByText(/hello,/i)).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sign out/i }),
    ).toBeInTheDocument()
  })

  it('persists session across page refreshes', async () => {
    const { unmount } = render(<App />)

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@test.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }))
    })

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@test.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }))
    })

    unmount()

    const { getByText, getByRole } = render(<App />)

    expect(getByText(/hello,/i)).toBeInTheDocument()
    expect(getByText('John')).toBeInTheDocument()
    expect(getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('sign out returns to login', async () => {
    render(<App />)

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@test.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }))
    })

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@test.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }))
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    })

    expect(
      screen.getByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/hello,/i)).not.toBeInTheDocument()
  })
})
