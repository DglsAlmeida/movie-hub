import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders search input with placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument()
  })

  it('renders custom placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="Find films..." />)
    expect(screen.getByPlaceholderText('Find films...')).toBeInTheDocument()
  })

  it('calls onSearch after debounce delay', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} debounceMs={300} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Batman' },
    })

    expect(onSearch).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(onSearch).toHaveBeenCalledWith('Batman')
  })

  it('shows clear button when input has value', () => {
    render(<SearchBar onSearch={vi.fn()} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Batman' },
    })

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('hides clear button when input is empty', () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('clears input and calls onSearch with empty string when clear is clicked', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Batman' },
    })

    fireEvent.click(screen.getByLabelText('Clear search'))

    expect(screen.getByRole('textbox')).toHaveValue('')
    expect(onSearch).toHaveBeenCalledWith('')
  })

  it('has correct aria-label', () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(screen.getByLabelText('Search movies')).toBeInTheDocument()
  })
})
