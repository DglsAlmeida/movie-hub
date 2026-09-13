import axios from 'axios'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

export const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
})

tmdbClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      return Promise.reject(
        new Error('Too many requests. Please try again later.'),
      )
    }
    if (error.response?.status === 401) {
      return Promise.reject(
        new Error('Invalid API key. Please check your configuration.'),
      )
    }
    return Promise.reject(error)
  },
)
