import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchMovies } from '../services/useSearch'
import { MovieGrid } from '../components/MovieGrid'
import { SearchBar } from '../components/SearchBar'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle, RotateCcw } from 'lucide-react'

export const SearchPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, error, refetch } = useSearchMovies(searchQuery)

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
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Failed to search movies'}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </div>
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
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <section>
        {isLoading ? (
          <LoadingSkeleton />
        ) : searchQuery ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              {data?.results.length
                ? `Found ${data.results.length} results for "${searchQuery}"`
                : `No results for "${searchQuery}"`}
            </h2>
            <MovieGrid
              movies={data?.results || []}
              onMovieClick={handleMovieClick}
            />
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
