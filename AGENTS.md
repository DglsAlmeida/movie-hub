# Agent Instructions

## Project Overview

This is a React + TypeScript + Vite application that evolves from a simple auth prototype into a Netflix-style movies app.

## Tech Stack

- React 19 + TypeScript 6
- Vite 8 + Tailwind CSS 4
- Shadcn UI components
- React Query (TanStack Query) for server state
- Zustand for client state (planned)
- React Router for navigation
- Vitest for unit/integration tests
- Playwright for e2e tests

## Code Style

- Arrow functions as default
- No semicolons
- Single quotes
- Trailing commas
- 80 char line width

## Testing

- Unit tests: `npm test`
- E2E tests: `npx playwright test`
- All tests must pass before committing

## Git Conventions

- Conventional commits (feat:, fix:, chore:, etc.)
- One atomic commit per task
- Never commit secrets or API keys

## File Structure

```
src/
├── features/
│   ├── auth/         # Auth feature (legacy)
│   └── movies/       # Movies feature
│       ├── components/
│       ├── services/
│       ├── types/
│       └── pages/
├── components/ui/    # Shadcn components
├── lib/              # Shared utilities
└── schemas/          # Zod schemas
```
