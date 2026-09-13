import { tmdbClient } from '@/lib/axios'
import type { MovieResponse, GenreResponse } from '../types/tmdb'

export const getTrendingMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await tmdbClient.get<MovieResponse>('/trending/movie/week', {
    params: { page },
  })
  return response.data
}

export const searchMovies = async (
  query: string,
  page = 1,
): Promise<MovieResponse> => {
  const response = await tmdbClient.get<MovieResponse>('/search/movie', {
    params: { query, page },
  })
  return response.data
}

export const getGenres = async (): Promise<GenreResponse> => {
  const response = await tmdbClient.get<GenreResponse>('/genre/movie/list')
  return response.data
}

export const discoverMoviesByGenre = async (
  genreIds: number[],
  page = 1,
): Promise<MovieResponse> => {
  const response = await tmdbClient.get<MovieResponse>('/discover/movie', {
    params: {
      with_genres: genreIds.join(','),
      page,
    },
  })
  return response.data
}
