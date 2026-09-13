# PRD - Movies App

## Overview

Evolve the existing auth app into a Netflix-style movies application with browse, search, watchlist, and favorites features.

## Goals

- Build a modern movie discovery platform
- Provide seamless user experience with Netflix-style UI
- Leverage existing auth system for personalized features

## User Stories

### Phase 1: Search + Browse

- As a user, I can search movies by title
- As a user, I can browse trending movies
- As a user, I can browse movies by genre
- As a user, I can see movie posters, ratings, and release dates

### Phase 2: Movie Details

- As a user, I can view movie details (title, overview, cast, rating)
- As a user, I can watch movie trailers
- As a user, I can see similar movies

### Phase 3: Watchlist + Favorites

- As a logged-in user, I can add movies to my watchlist
- As a logged-in user, I can mark movies as favorites
- As a logged-in user, I can view my watchlist and favorites
- As a user, my data persists across sessions

### Phase 4: Polish

- As a user, I see smooth animations and transitions
- As a user, I can use the app on mobile devices
- As a user, I get proper loading and error states

## Technical Requirements

### Data Source

- TMDB API (https://api.themoviedb.org/3)
- API key stored in `.env.local` as `VITE_TMDB_API_KEY`

### Tech Stack

- React 19 + TypeScript 6
- Vite 8 + Tailwind CSS 4
- Shadcn UI components
- React Query (TanStack Query) for API state
- Zustand for client state (watchlist, favorites)
- React Router for navigation

### API Endpoints (TMDB)

- `/trending/movie/week` - Trending movies
- `/search/movie` - Search movies
- `/genre/movie/list` - Movie genres
- `/movie/{id}` - Movie details
- `/movie/{id}/credits` - Movie cast
- `/movie/{id}/videos` - Movie trailers
- `/movie/{id}/similar` - Similar movies

## Success Metrics

- Page load time < 2s
- Search results appear < 500ms
- All tests passing (unit + e2e)
- Mobile responsive design

## Out of Scope

- User reviews/ratings
- Social features
- Video streaming
- User-generated content
