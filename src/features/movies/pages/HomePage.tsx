import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrendingMovies } from '../services/useTrending'
import { useSearchMovies } from '../services/useSearch'
import { useGenres } from '../services/useGenres'
import { useMovieBrowser } from '../hooks/useMovieBrowser'
import { MovieGrid } from '../components/MovieGrid'
import { SearchBar } from '../components/SearchBar'
import { GenreFilter } from '../components/GenreFilter'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorState } from '../components/ErrorState'

export const HomePage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const trending = useTrendingMovies()
  const search = useSearchMovies(searchQuery)
  const genres = useGenres()

  const {
    movies,
    isLoading,
    error,
    genres: genreOptions,
    selectedGenres,
    handleGenreToggle,
    refetch,
  } = useMovieBrowser({ trending, search, genres, searchQuery })

  const handleMovieClick = (movie: { id: number }) => {
    navigate(`/movie/${movie.id}`)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          message={
            error instanceof Error ? error.message : 'Failed to load movies'
          }
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">MovieHub</h1>
        <div className="flex flex-col gap-4">
          <SearchBar onSearch={setSearchQuery} />
          {!searchQuery && genreOptions.length > 0 && (
            <GenreFilter
              genres={genreOptions}
              selectedGenres={selectedGenres}
              onGenreToggle={handleGenreToggle}
            />
          )}
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {searchQuery ? 'Search Results' : 'Trending This Week'}
        </h2>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <MovieGrid movies={movies} onMovieClick={handleMovieClick} />
        )}
      </section>
    </div>
  )
}
