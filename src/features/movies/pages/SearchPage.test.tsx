import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { SearchPage } from './SearchPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../services/useSearch', () => ({
  useSearchMovies: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page title', () => {
    render(<SearchPage />, { wrapper: createWrapper() })
    expect(screen.getByText('Search Movies')).toBeInTheDocument()
  })

  it('renders back button', () => {
    render(<SearchPage />, { wrapper: createWrapper() })
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })

  it('renders search bar', () => {
    render(<SearchPage />, { wrapper: createWrapper() })
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument()
  })

  it('renders empty state message', () => {
    render(<SearchPage />, { wrapper: createWrapper() })
    expect(
      screen.getByText('Start typing to search for movies'),
    ).toBeInTheDocument()
  })

  it('navigates to home when back button is clicked', () => {
    render(<SearchPage />, { wrapper: createWrapper() })
    screen.getByText('Back to Home').click()
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
