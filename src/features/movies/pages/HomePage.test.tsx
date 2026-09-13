import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockTrendingResponse = {
  results: [
    {
      id: 1,
      title: 'Trending Movie',
      overview: 'Overview',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2024-01-01',
      vote_average: 8.0,
      vote_count: 100,
      genre_ids: [28],
      popularity: 50,
      adult: false,
      original_language: 'en',
      original_title: 'Trending Movie',
      video: false,
    },
  ],
  total_pages: 1,
  total_results: 1,
  page: 1,
}

const mockGenresResponse = {
  genres: [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
  ],
}

vi.mock('../services/useTrending', () => ({
  useTrendingMovies: () => ({
    data: mockTrendingResponse,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

vi.mock('../services/useSearch', () => ({
  useSearchMovies: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
}))

vi.mock('../services/useGenres', () => ({
  useGenres: () => ({
    data: mockGenresResponse,
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

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page title', () => {
    render(<HomePage />, { wrapper: createWrapper() })
    expect(screen.getByText('MovieHub')).toBeInTheDocument()
  })

  it('renders trending section header', () => {
    render(<HomePage />, { wrapper: createWrapper() })
    expect(screen.getByText('Trending This Week')).toBeInTheDocument()
  })

  it('renders trending movies', async () => {
    render(<HomePage />, { wrapper: createWrapper() })
    await waitFor(() => {
      expect(screen.getByText('Trending Movie')).toBeInTheDocument()
    })
  })

  it('renders genre filters', () => {
    render(<HomePage />, { wrapper: createWrapper() })
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Comedy')).toBeInTheDocument()
  })

  it('renders search bar', () => {
    render(<HomePage />, { wrapper: createWrapper() })
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument()
  })
})
