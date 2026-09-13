import type { Genre } from '../types/tmdb'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface GenreFilterProps {
  genres: Genre[]
  selectedGenres: number[]
  onGenreToggle: (genreId: number) => void
}

export const GenreFilter = ({
  genres,
  selectedGenres,
  onGenreToggle,
}: GenreFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => {
        const isSelected = selectedGenres.includes(genre.id)
        return (
          <Badge
            key={genre.id}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-colors',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary',
            )}
            onClick={() => onGenreToggle(genre.id)}
            role="checkbox"
            aria-checked={isSelected}
            aria-label={`${genre.name} genre`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onGenreToggle(genre.id)
              }
            }}
          >
            {genre.name}
          </Badge>
        )
      })}
    </div>
  )
}
