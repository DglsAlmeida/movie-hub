import { useState } from 'react'
import { useSearchMovies } from '../services/useSearch'

export const useSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, error, refetch } = useSearchMovies(searchQuery)

  return {
    searchQuery,
    handleSearch: setSearchQuery,
    movies: data?.results ?? [],
    isLoading,
    error,
    refetch,
  }
}