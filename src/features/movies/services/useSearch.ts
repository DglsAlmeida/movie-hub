import { useQuery } from '@tanstack/react-query'
import { searchMovies } from './tmdb'

export const useSearchMovies = (query: string, page = 1) => {
  return useQuery({
    queryKey: ['search', query, page],
    queryFn: () => searchMovies(query, page),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
  })
}
