# ADR - Movies App Architecture Decisions

## ADR-001: TMDB API as Data Source

**Status**: Accepted

**Context**: Need a movie data source for the app.

**Decision**: Use TMDB (The Movie Database) API.

**Consequences**:

- Free tier available with 40 requests/10 seconds
- Rich data: posters, cast, trailers, ratings
- Well-documented REST API
- Requires API key registration

---

## ADR-002: React Query for Server State

**Status**: Accepted

**Context**: Need to manage API data, caching, loading states.

**Decision**: Use TanStack Query (React Query) for all TMDB API calls.

**Consequences**:

- Automatic caching and background refetching
- Built-in loading/error states
- Deduplication of requests
- Devtools for debugging

---

## ADR-003: Zustand for Client State

**Status**: Accepted

**Context**: Need to manage watchlist and favorites with persistence.

**Decision**: Use Zustand with sessionStorage persistence.

**Consequences**:

- Lightweight (~1kb)
- Simple API, no boilerplate
- Works with React Query
- Persists across page refreshes

---

## ADR-004: Shadcn UI Component Library

**Status**: Accepted

**Context**: Need consistent, accessible UI components.

**Decision**: Use Shadcn UI with Tailwind CSS.

**Consequences**:

- Copy-paste components (no runtime dependency)
- Fully customizable with Tailwind
- Accessible by default
- Growing component ecosystem

---

## ADR-005: Feature-Based File Structure

**Status**: Accepted

**Context**: Need scalable code organization.

**Decision**: Organize by feature, not by type.

```
src/
├── features/
│   ├── auth/         # Existing auth logic
│   └── movies/       # New movies feature
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── api/
├── lib/              # Shared utilities
├── schemas/          # Zod schemas
└── components/ui/    # Shadcn components
```

**Consequences**:

- Co-located related code
- Easy to find and refactor
- Scales to multiple features
- Clear boundaries between domains

---

## ADR-006: React Router for Navigation

**Status**: Accepted

**Context**: Need client-side routing for movie pages.

**Decision**: Use React Router v7.

**Consequences**:

- Standard for React apps
- URL-based navigation
- Browser history support
- Shareable links

---

## ADR-007: Phased Implementation

**Status**: Accepted

**Context**: Need to break down work into manageable chunks.

**Decision**: Implement in 4 phases.

| Phase | Focus                 | Dependencies           |
| ----- | --------------------- | ---------------------- |
| 1     | Search + Browse       | TMDB API, React Query  |
| 2     | Movie Details         | Phase 1                |
| 3     | Watchlist + Favorites | Phase 1, Zustand, Auth |
| 4     | Polish                | All phases             |

**Consequences**:

- Each phase is independently testable
- Can deploy after each phase
- Reduces risk of big-bang release
- Easy to pause and resume
