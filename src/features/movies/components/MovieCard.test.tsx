import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MovieCard } from './MovieCard'
import type { Movie } from '../types/tmdb'

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2024-01-15',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [28, 12],
  popularity: 100.5,
  adult: false,
  original_language: 'en',
  original_title: 'Test Movie',
  video: false,
}

describe('MovieCard', () => {
  it('renders movie title', () => {
    render(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('renders release year', () => {
    render(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('2024')).toBeInTheDocument()
  })

  it('renders rating', () => {
    render(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('8.5')).toBeInTheDocument()
  })

  it('renders poster image', () => {
    render(<MovieCard movie={mockMovie} />)
    const img = screen.getByAltText('Test Movie poster')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500/test-poster.jpg',
    )
  })

  it('renders placeholder when poster is null', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null }
    render(<MovieCard movie={movieWithoutPoster} />)
    const img = screen.getByAltText('Test Movie poster')
    expect(img).toHaveAttribute('src', '/placeholder-movie.png')
  })

  it('shows TBA when release date is empty', () => {
    const movieWithoutDate = { ...mockMovie, release_date: '' }
    render(<MovieCard movie={movieWithoutDate} />)
    expect(screen.getByText('TBA')).toBeInTheDocument()
  })

  it('shows N/A when rating is 0', () => {
    const movieWithZeroRating = { ...mockMovie, vote_average: 0 }
    render(<MovieCard movie={movieWithZeroRating} />)
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<MovieCard movie={mockMovie} onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledWith(mockMovie)
  })

  it('calls onClick when Enter key is pressed', () => {
    const handleClick = vi.fn()
    render(<MovieCard movie={mockMovie} onClick={handleClick} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledWith(mockMovie)
  })

  it('has correct aria-label', () => {
    render(<MovieCard movie={mockMovie} />)
    expect(
      screen.getByRole('button', { name: 'View details for Test Movie' }),
    ).toBeInTheDocument()
  })
})
