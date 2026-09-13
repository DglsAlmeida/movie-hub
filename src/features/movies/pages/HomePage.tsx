import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrendingMovies } from '../services/useTrending'
import { useSearchMovies } from '../services/useSearch'
import { useGenres } from '../services/useGenres'
import { MovieGrid } from '../components/MovieGrid'
import { SearchBar } from '../components/SearchBar'
import { GenreFilter } from '../components/GenreFilter'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw } from 'lucide-react'

export const HomePage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])

  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useTrendingMovies()

  const { data: genresData } = useGenres()

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchMovies(searchQuery)

  const handleMovieClick = (movie: { id: number }) => {
    navigate(`/movie/${movie.id}`)
  }

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    )
  }

  const isLoading = searchQuery ? searchLoading : trendingLoading
  const error = searchQuery ? searchError : trendingError
  const movies = searchQuery ? searchData?.results : trendingData?.results

  const filteredMovies =
    selectedGenres.length > 0
      ? movies?.filter((movie) =>
          movie.genre_ids.some((id) => selectedGenres.includes(id)),
        )
      : movies

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Failed to load movies'}
          </p>
          <Button onClick={() => refetchTrending()} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">MovieHub</h1>
        <div className="flex flex-col gap-4">
          <SearchBar onSearch={setSearchQuery} />
          {!searchQuery && genresData?.genres && (
            <GenreFilter
              genres={genresData.genres}
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
          <MovieGrid
            movies={filteredMovies || []}
            onMovieClick={handleMovieClick}
          />
        )}
      </section>
    </div>
  )
}
