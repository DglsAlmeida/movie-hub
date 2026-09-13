import { useState } from 'react'
import type { GenreResponse, MovieResponse } from '../types/tmdb'

interface QueryResult<T> {
  data?: T
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

interface UseMovieBrowserParams {
  trending: QueryResult<MovieResponse>
  search: QueryResult<MovieResponse>
  genres: QueryResult<GenreResponse>
  searchQuery: string
}

export const useMovieBrowser = ({
  trending,
  search,
  genres,
  searchQuery,
}: UseMovieBrowserParams) => {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    )
  }

  const isLoading = searchQuery ? search.isLoading : trending.isLoading
  const error = searchQuery ? search.error : trending.error
  const source = searchQuery ? search.data : trending.data
  const movies = source?.results ?? []

  const filteredMovies =
    selectedGenres.length > 0
      ? movies.filter((movie) =>
          movie.genre_ids.some((id) => selectedGenres.includes(id)),
        )
      : movies

  return {
    movies: filteredMovies,
    isLoading,
    error,
    genres: genres.data?.genres ?? [],
    selectedGenres,
    handleGenreToggle,
    refetch: trending.refetch,
  }
}