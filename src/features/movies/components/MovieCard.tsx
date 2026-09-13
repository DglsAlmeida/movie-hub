import type { Movie } from '../types/tmdb'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

interface MovieCardProps {
  movie: Movie
  onClick?: (movie: Movie) => void
}

const getPosterUrl = (posterPath: string | null, size = 'w500'): string => {
  if (!posterPath) {
    return '/placeholder-movie.png'
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`
}

const getReleaseYear = (releaseDate: string): string => {
  if (!releaseDate) return 'TBA'
  return new Date(releaseDate).getFullYear().toString()
}

const getRating = (voteAverage: number): string => {
  if (voteAverage === 0) return 'N/A'
  return voteAverage.toFixed(1)
}

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const handleClick = () => {
    onClick?.(movie)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.(movie)
    }
  }

  return (
    <Card
      className={cn(
        'overflow-hidden transition-transform hover:scale-105 cursor-pointer',
        onClick && 'hover:shadow-lg',
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${movie.title}`}
    >
      <div className="aspect-[2/3] relative">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={`${movie.title} poster`}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm font-semibold">
          {getRating(movie.vote_average)}
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
          {movie.title}
        </h3>
        <p className="text-muted-foreground text-xs">
          {getReleaseYear(movie.release_date)}
        </p>
      </CardContent>
    </Card>
  )
}
