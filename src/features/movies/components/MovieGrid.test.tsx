import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MovieGrid } from './MovieGrid'
import type { Movie } from '../types/tmdb'

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Movie 1',
    overview: 'Overview 1',
    poster_path: '/poster1.jpg',
    backdrop_path: '/backdrop1.jpg',
    release_date: '2024-01-01',
    vote_average: 8.0,
    vote_count: 100,
    genre_ids: [28],
    popularity: 50,
    adult: false,
    original_language: 'en',
    original_title: 'Movie 1',
    video: false,
  },
  {
    id: 2,
    title: 'Movie 2',
    overview: 'Overview 2',
    poster_path: '/poster2.jpg',
    backdrop_path: '/backdrop2.jpg',
    release_date: '2024-02-15',
    vote_average: 7.5,
    vote_count: 200,
    genre_ids: [35],
    popularity: 75,
    adult: false,
    original_language: 'en',
    original_title: 'Movie 2',
    video: false,
  },
]

describe('MovieGrid', () => {
  it('renders all movies', () => {
    render(<MovieGrid movies={mockMovies} />)
    expect(screen.getByText('Movie 1')).toBeInTheDocument()
    expect(screen.getByText('Movie 2')).toBeInTheDocument()
  })

  it('renders empty state when no movies', () => {
    render(<MovieGrid movies={[]} />)
    expect(screen.getByText('No movies found')).toBeInTheDocument()
  })

  it('renders correct number of movie cards', () => {
    render(<MovieGrid movies={mockMovies} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  it('calls onMovieClick when movie is clicked', () => {
    const handleClick = vi.fn()
    render(<MovieGrid movies={mockMovies} onMovieClick={handleClick} />)
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(handleClick).toHaveBeenCalledWith(mockMovies[0])
  })

  it('applies responsive grid classes', () => {
    const { container } = render(<MovieGrid movies={mockMovies} />)
    expect(container.firstChild).toHaveClass(
      'grid',
      'grid-cols-2',
      'sm:grid-cols-3',
      'md:grid-cols-4',
      'lg:grid-cols-5',
    )
  })
})
