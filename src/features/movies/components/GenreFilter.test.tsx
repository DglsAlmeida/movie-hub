import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GenreFilter } from './GenreFilter'
import type { Genre } from '../types/tmdb'

const mockGenres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
]

describe('GenreFilter', () => {
  it('renders all genres', () => {
    render(
      <GenreFilter
        genres={mockGenres}
        selectedGenres={[]}
        onGenreToggle={vi.fn()}
      />,
    )
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Comedy')).toBeInTheDocument()
    expect(screen.getByText('Drama')).toBeInTheDocument()
  })

  it('marks selected genres as checked', () => {
    render(
      <GenreFilter
        genres={mockGenres}
        selectedGenres={[28, 35]}
        onGenreToggle={vi.fn()}
      />,
    )
    expect(
      screen.getByRole('checkbox', { name: 'Action genre' }),
    ).toHaveAttribute('aria-checked', 'true')
    expect(
      screen.getByRole('checkbox', { name: 'Comedy genre' }),
    ).toHaveAttribute('aria-checked', 'true')
    expect(
      screen.getByRole('checkbox', { name: 'Drama genre' }),
    ).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onGenreToggle when genre is clicked', () => {
    const onGenreToggle = vi.fn()
    render(
      <GenreFilter
        genres={mockGenres}
        selectedGenres={[]}
        onGenreToggle={onGenreToggle}
      />,
    )
    fireEvent.click(screen.getByText('Action'))
    expect(onGenreToggle).toHaveBeenCalledWith(28)
  })

  it('calls onGenreToggle when Enter key is pressed', () => {
    const onGenreToggle = vi.fn()
    render(
      <GenreFilter
        genres={mockGenres}
        selectedGenres={[]}
        onGenreToggle={onGenreToggle}
      />,
    )
    fireEvent.keyDown(screen.getByText('Comedy'), { key: 'Enter' })
    expect(onGenreToggle).toHaveBeenCalledWith(35)
  })

  it('applies correct styles to selected genres', () => {
    render(
      <GenreFilter
        genres={mockGenres}
        selectedGenres={[28]}
        onGenreToggle={vi.fn()}
      />,
    )
    const actionBadge = screen.getByText('Action')
    expect(actionBadge).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('applies correct styles to unselected genres', () => {
    render(
      <GenreFilter
        genres={mockGenres}
        selectedGenres={[28]}
        onGenreToggle={vi.fn()}
      />,
    )
    const comedyBadge = screen.getByText('Comedy')
    expect(comedyBadge).toHaveClass('border')
    expect(comedyBadge).toHaveClass('cursor-pointer')
  })
})
