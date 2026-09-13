# Separation of Concerns (Movies) Specification

## Problem Statement

HomePage and SearchPage mix business rules (mode slicing, genre selection, filtering) directly into render. The data-fetching concern is already isolated (React Query hooks in `services/`), but derived view-state logic is entangled with JSX, making the pages harder to test and reason about. We will extract this logic into container hooks, leaving pages purely presentational, and deduplicate the shared error UI.

## Goals

- [x] HomePage derives all view-state from `useMovieBrowser` with zero inline business logic
- [x] SearchPage derives its query-state from `useSearchPage`
- [x] Error UI is served by a single shared `ErrorState` component
- [x] All 69 existing unit tests pass unchanged (behavior-preserving refactor)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Auth feature refactor | Already follows the container/presentational pattern (`useAuthRedirect` + composable pages) |
| Test rewrites / new hook unit tests | Existing service-level mocks keep passing through the real hooks; deferred to a future task |
| UI / behavior changes | Strictly a structural refactor |
| Extracting every page sub-section into components | Kept JSX inline but pure — avoids speculative generality |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
|----------------------|---------------|-----------|------------|
| Container mechanism | Custom hooks in `features/movies/hooks/` | Matches article's modern hook approach + auth convention | y |
| Where navigation lives | Pages keep `useNavigate` | Navigation is a view-layer concern | y |
| Where query hooks live | Pages keep React Query hooks (`useTrending`, `useSearch`, `useGenres`) | They are already isolated containers in `services/` | y |
| `useMovieBrowser` input contract | Receives query results as params (DI shape) | Queries stay in page; hook is pure-ish and unit-testable | y |
| SearchPage treatment | Thin `useSearchPage` hook for symmetry | User decision | y |
| `ErrorState` location | `features/movies/components/ErrorState.tsx` | Movies-scoped for now; extract to shared only when a second feature needs it | y |
| Behavior preservation | Strict — no markup or UX changes | Architecture refactor; UI changes get their own spec | y |
| Test strategy | No test file changes | Existing mocks still apply through the real container hooks | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Home Page Renders Through a Container Hook ⭐ MVP

**User Story**: As a developer, I want the home page's business rules extracted into `useMovieBrowser` so that the page is purely presentational and the logic is testable in isolation.

**Why P1**: This is the core of the refactor — HomePage has the most entangled logic (mode slicing, genre state, filtering).

**Acceptance Criteria**:

1. WHEN the home page renders AND no search query is set THEN the system SHALL derive the displayed movies and loading state from the trending query results <!-- event-driven -->
2. WHEN a search query is set THEN the system SHALL derive the displayed movies, loading state, and error from the search query results <!-- event-driven -->
3. WHEN the user selects a genre THEN the system SHALL derive the displayed movies as only those whose `genre_ids` include the selected genre <!-- event-driven -->
4. WHEN the user selects a genre that is already selected THEN the system SHALL deselect it <!-- event-driven -->
5. IF the active query (trending or search) fails THEN the system SHALL render `ErrorState` with the retry action wired to the query refetch <!-- unwanted-behavior -->
6. The home page SHALL obtain all derived view-state from `useMovieBrowser` <!-- ubiquitous -->
7. The home page SHALL contain no expression that slices or filters movie data <!-- ubiquitous -->

**Independent Test**: Can verify by exercising the app — trending shows on load, search switches results, genre chips filter the grid, and a failed request shows the shared error block with working "Try again".

---

### P2: Search Page Renders Through a Container Hook

**User Story**: As a developer, I want the search page's query-state extracted into `useSearchPage` for symmetry with the home page.

**Why P2**: Keeps the pattern consistent across both movies pages.

**Acceptance Criteria**:

1. The search page SHALL obtain its search-query state from `useSearchPage` <!-- ubiquitous -->
2. The search page SHALL contain no query-state business logic in its body <!-- ubiquitous -->
3. IF the search query fails THEN the search page SHALL render `ErrorState` with the retry action <!-- unwanted-behavior -->

**Independent Test**: Type in the search box — results and counts render as today; a failure shows the shared error block.

---

### P3: Shared ErrorState Component

**User Story**: As a developer, I want one reusable error presentation so the duplicated error blocks across pages are removed.

**Why P3**: Directly removes the most visible duplication in the two pages.

**Acceptance Criteria**:

1. The movies feature SHALL provide a single `ErrorState` presentational component in `features/movies/components` that renders the failure message and retry action <!-- ubiquitous -->
2. Both the home page and the search page SHALL use `ErrorState` for their failure state <!-- ubiquitous -->

**Independent Test**: Trigger a failed request on either page — both render the same shared error block.

---

## Edge Cases

- IF the active query fails THEN system SHALL render the error state and keep the retry action functional <!-- IF/THEN -->
- WHEN search is active AND no genres exist to filter THEN the genre filter SHALL NOT render (unchanged behavior) <!-- state-driven -->

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|---------------|-------|-------|--------|
| SOC-01 | P1: Home Page Through Container Hook | Verified | Verified |
| SOC-02 | P1: Home Page Through Container Hook | Verified | Verified |
| SOC-03 | P1: Home Page Through Container Hook | Verified | Verified |
| SOC-04 | P1: Home Page Through Container Hook | Verified | Verified |
| SOC-05 | P1: Home Page Through Container Hook | Verified | Verified |
| SOC-06 | P1: Home Page Through Container Hook | Verified | Verified |
| SOC-07 | P1: Home Page Through Container Hook | Verified | Verified |
| SOC-08 | P2: Search Page Through Container Hook | Verified | Verified |
| SOC-09 | P2: Search Page Through Container Hook | Verified | Verified |
| SOC-10 | P2: Search Page Through Container Hook | Verified | Verified |
| SOC-11 | P3: Shared ErrorState Component | Verified | Verified |
| SOC-12 | P3: Shared ErrorState Component | Verified | Verified |

**Coverage:** 12 total, 12 mapped to tasks, 0 unmapped ✅

---

## Success Criteria

- [x] All unit tests pass unchanged (`npm test`)
- [x] TypeScript build passes (`npm run check-types`)
- [x] HomePage and SearchPage contain no business-logic expressions (mode slicing, filtering, query-state)
- [x] Error UI rendered from a single `ErrorState` component