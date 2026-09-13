import { useQuery } from '@tanstack/react-query'
import { getGenres } from './tmdb'

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
    staleTime: 24 * 60 * 60 * 1000,
  })
}
