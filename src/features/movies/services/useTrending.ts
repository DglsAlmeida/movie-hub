import { useQuery } from '@tanstack/react-query'
import { getTrendingMovies } from './tmdb'

export const useTrendingMovies = (page = 1) => {
  return useQuery({
    queryKey: ['trending', page],
    queryFn: () => getTrendingMovies(page),
    staleTime: 5 * 60 * 1000,
  })
}
