import { useNavigate } from 'react-router-dom'
import { useSearchPage } from '../hooks/useSearchPage'
import { MovieGrid } from '../components/MovieGrid'
import { SearchBar } from '../components/SearchBar'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorState } from '../components/ErrorState'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const SearchPage = () => {
  const navigate = useNavigate()
  const { searchQuery, handleSearch, movies, isLoading, error, refetch } =
    useSearchPage()

  const handleMovieClick = (movie: { id: number }) => {
    navigate(`/movie/${movie.id}`)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Search Movies</h1>
        </div>
        <ErrorState
          message={
            error instanceof Error ? error.message : 'Failed to search movies'
          }
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold mb-4">Search Movies</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <section>
        {isLoading ? (
          <LoadingSkeleton />
        ) : searchQuery ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              {movies.length
                ? `Found ${movies.length} results for "${searchQuery}"`
                : `No results for "${searchQuery}"`}
            </h2>
            <MovieGrid movies={movies} onMovieClick={handleMovieClick} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Start typing to search for movies
            </p>
          </div>
        )}
      </section>
    </div>
  )
}