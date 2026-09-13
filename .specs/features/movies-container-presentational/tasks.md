# Separation of Concerns (Movies) Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: skipped (Medium scope - design inline)
**Status**: Approved

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `AGENTS.md` (testing section: unit `npm test`, e2e `npx playwright test`). Spec assumption SOC-TEST-1 (user-confirmed): no test file changes this feature; existing page suites exercise the new hooks through the unchanged `services/` mocks. No e2e scope - pure UI-refactor, no routes or workflows change.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Container hooks (business logic) | none (deferred per SOC-TEST-1) | Behavior preserved: existing page suites pass unchanged through real hooks | `src/features/movies/hooks/*.test.ts` | `npm test` |
| Presentational components | none (deferred per SOC-TEST-1) | Existing page suites render the wired pages | `src/features/movies/components/*.test.tsx` | `npm test` |
| Pages | unit (existing, unchanged) | Same suites, same spec outcomes, no assertion changes | `src/features/movies/pages/*.test.tsx` | `npm test` |
| Config / types / schema | none | - (build gate only) | - | `npm run build` |

## Gate Check Commands

> Generated from codebase - confirm before Execute.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | After tasks with unit tests only | `npm test` |
| Full | After final wiring / last task of phase | `npm test && npm run build && npm run lint` |
| Build | After component-only/config tasks | `npm run build && npm run lint` |

---

## Execution Plan

Phases are ordered and run sequentially - each phase completes before the next begins, and tasks within a phase execute in order.

### Phase 1: Shared Component

```
T1
```

### Phase 2: Container Hooks

```
T2, T3 (independent)
```

### Phase 3: Page Wiring

```
T4, T5 (independent), then T6
```

---

## Task Breakdown

### T1: Add ErrorState presentational component

**What**: One reusable failure-state component rendering the error message and a retry action.
**Where**: `src/features/movies/components/ErrorState.tsx`
**Depends on**: None
**Reuses**: `@/components/ui/button` styling like the existing error blocks in `HomePage.tsx` / `SearchPage.tsx`
**Requirement**: SOC-11, SOC-12 (usage wired in T4/T5)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Component accepts `message` and `onRetry` props and renders the exact error block currently duplicated in HomePage/SearchPage (AlertCircle icon, title, message, retry Button)
- [ ] Markup is byte-equivalent to the existing inline error blocks (behavior/UX preserved)
- [ ] Gate check passes: `npm run build && npm run lint`
- [ ] Test count: existing suite count unchanged (no files added/skipped)

**Tests**: none (deferred per SOC-TEST-1)
**Gate**: build

**Commit**: `refactor(movies): add shared ErrorState component`

---

### T2: Add useMovieBrowser container hook

**What**: One hook that owns mode slicing, genre selection state, and genre filtering for the home page; receives query results as parameters (DI shape).
**Where**: `src/features/movies/hooks/useMovieBrowser.ts`
**Depends on**: None
**Reuses**: `Movie` / `Genre` types from `../types/tmdb`
**Requirement**: SOC-01, SOC-02, SOC-03, SOC-04, SOC-06 (state source), SOC-07 (no inline logic)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Signature: `useMovieBrowser({ trending, search, genres })` where each param is the result object of the corresponding React Query hook
- [ ] Returns derived view-model: `movies`, `isLoading`, `error`, `genres`, `selectedGenres`, `handleGenreToggle`, `refetch` (only what HomePage renders)
- [ ] Mode slicing: movies/loading/error come from `search` when a search query is present, else from `trending`
- [ ] Genre filter: displays only movies whose `genre_ids` include every selected genre; empty selection shows all
- [ ] Genre toggle: adds unselected ids, removes already-selected ids
- [ ] Gate check passes: `npm run build && npm run lint`
- [ ] Test count: existing suite count unchanged

**Tests**: none (deferred per SOC-TEST-1)
**Gate**: build

**Commit**: `refactor(movies): add useMovieBrowser container hook`

---

### T3: Add useSearchPage container hook

**What**: Thin hook holding the search page's query state; kept for symmetry with the home page.
**Where**: `src/features/movies/hooks/useSearchPage.ts`
**Depends on**: None
**Reuses**: `useSearchMovies` from `../services/useSearch`
**Requirement**: SOC-08, SOC-09, SOC-10 (error surfaced to page)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Signature: `useSearchPage()` and returns `searchQuery`, `handleSearch`, `movies`, `isLoading`, `error`, `refetch`
- [ ] Hosts the `searchQuery` state currently inline in `SearchPage.tsx`
- [ ] Gate check passes: `npm run build && npm run lint`
- [ ] Test count: existing suite count unchanged

**Tests**: none (deferred per SOC-TEST-1)
**Gate**: build

**Commit**: `refactor(movies): add useSearchPage container hook`

---

### T4: Wire HomePage through useMovieBrowser and ErrorState

**What**: HomePage body becomes presentational: calls hooks/queries for data, delegates state derivation + filtering to `useMovieBrowser`, renders `ErrorState` on failure; removes its inline logic.
**Where**: `src/features/movies/pages/HomePage.tsx`
**Depends on**: T1, T2
**Reuses**: `useMovieBrowser`, `ErrorState`, existing `SearchBar` / `GenreFilter` / `MovieGrid` / `LoadingSkeleton`
**Requirement**: SOC-01..SOC-07, SOC-11, SOC-12

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `useNavigate` and the three React Query hooks stay in the page (per spec assumption)
- [ ] All derived view-state passes through `useMovieBrowser`; no ternary mode-slicing, filtering, or genre-state logic remains in the page body
- [ ] Error branch renders `<ErrorState />` with the same message + retry behavior as today
- [ ] Markup/UX identical to pre-refactor HomePage
- [ ] Gate check passes: `npm test` with the existing `HomePage.test.tsx` suite passing unchanged
- [ ] Test count: ≥ existing count (no silent deletions)

**Tests**: unit (existing `src/features/movies/pages/HomePage.test.tsx`, unchanged)
**Gate**: quick

**Commit**: `refactor(movies): wire home page through useMovieBrowser`

---

### T5: Wire SearchPage through useSearchPage and ErrorState

**What**: SearchPage body becomes presentational: delegates query state to `useSearchPage`, renders `ErrorState` on failure; removes its inline query-state logic.
**Where**: `src/features/movies/pages/SearchPage.tsx`
**Depends on**: T1, T3
**Reuses**: `useSearchPage`, `ErrorState`, existing `SearchBar` / `MovieGrid` / `LoadingSkeleton`
**Requirement**: SOC-08..SOC-12

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `useNavigate` stays in the page (per spec assumption)
- [ ] Query-state logic comes from `useSearchPage`; no inline query-state logic remains
- [ ] Error branch renders `<ErrorState />` with the same message + retry behavior as today
- [ ] Markup/UX identical to pre-refactor SearchPage
- [ ] Full gate passes: `npm test && npm run build && npm run lint`
- [ ] Test count: ≥ existing count (no silent deletions)

**Tests**: unit (existing `src/features/movies/pages/SearchPage.test.tsx`, unchanged)
**Gate**: full

**Commit**: `refactor(movies): wire search page through useSearchPage`

---

### T6: Verify movies pages with Playwright e2e

**What**: Add an e2e spec that mocks the TMDB API and runs the app end-to-end in Chromium, asserting the refactored pages still render and the layout/behavior is intact on both the home and search pages.
**Where**: `e2e/movies.spec.ts`
**Depends on**: T4, T5
**Reuses**: existing Playwright setup (`playwright.config.ts`, auth-session seeding through `sessionStorage`)
**Requirement**: SOC-01..SOC-12 (behavior preservation, verified in the browser)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] A new `movies.spec.ts` mocks `trending`, `genre/list`, and `search/movie` TMDB endpoints via `page.route`
- [ ] It seeds an `auth_session` via `addInitScript` so the protected movies routes are reachable
- [ ] It covers pixel-independent layout assertions for HomePage (title, search bar, genre filters, movie grid) and SearchPage (title, back button, empty state)
- [ ] It covers feature tests: genre filtering narrows the grid, search switches results and clears back, error states render `ErrorState`, back navigation works
- [ ] Error-state cases wait past React Query's default retry window (`{ timeout: 15000 }` on `toBeVisible`)
- [ ] Full gate passes: `npx playwright test e2e/movies.spec.ts` → 9 passing

**Tests**: e2e (`e2e/movies.spec.ts`)
**Gate**: full

**Commit**: `test(e2e): add movies page e2e coverage with mocked TMDB API`

---

## Phase Execution Map

Visual representation of task ordering. Phases run in sequence, and tasks within a phase run in order:

```
Phase 1 → Phase 2 → Phase 3

Phase 1:  T1 --------------------------------------------→ T4
Phase 1:  T1 --------------------→ T5
Phase 2:  T2 --------------------→ T4
Phase 2:  T3 --------------------→ T5
```

Execution is strictly sequential - there is no intra-phase parallelism. A single agent works one task at a time, in order.

## Task Granularity Check

| Task | Scope | Status |
| ---- | ------ | ------ |
| T1: ErrorState component | 1 component | ✅ Granular |
| T2: useMovieBrowser hook | 1 hook | ✅ Granular |
| T3: useSearchPage hook | 1 hook | ✅ Granular |
| T4: Wire HomePage | 1 file change | ✅ Granular |
| T5: Wire SearchPage | 1 file change | ✅ Granular |
| T6: e2e movies spec | 1 spec file | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | T1 at root | ✅ Match |
| T2 | None | T2 at root | ✅ Match |
| T3 | None | T3 after T2 | ✅ Match (independent, same phase) |
| T4 | T1, T2 | T4 ← T1, T2 | ✅ Match |
| T5 | T1, T3 | T5 ← T1, T3 | ✅ Match |
| T6 | T4, T5 | T6 ← T4, T5 | ✅ Match |

---

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1: ErrorState | presentational component | none (deferred SOC-TEST-1) | none | ✅ OK |
| T2: useMovieBrowser | container hook | none (deferred SOC-TEST-1) | none | ✅ OK |
| T3: useSearchPage | container hook | none (deferred SOC-TEST-1) | none | ✅ OK |
| T4: HomePage | page (regression) | unit (existing suite) | unit | ✅ OK |
| T5: SearchPage | page (regression) | unit (existing suite) | unit | ✅ OK |
| T6: movies e2e | e2e spec | e2e (Playwright, per AGENTS.md) | e2e | ✅ OK |