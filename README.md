# MovieHub

An AI-first React application built entirely through conversation with [opencode](https://opencode.ai). No hand-written code — every line was specified, reviewed, and committed by AI agents following a structured development process.

## The Idea

MovieHub is a Netflix-style movies app where users can browse trending films, search by title, and filter by genre. But the real project here is the **process**, not the product.

This repo is an experiment: **can AI agents build a production-quality codebase from scratch using spec-driven development?**

The answer is yes — and this README documents how.

## How It Works

The entire development flow is driven by three principles:

1. **Specs before code** — Every feature starts with a written specification (EARS notation acceptance criteria), not a code snippet
2. **Tests derive from specs** — Tests assert spec-defined outcomes, not implementation details
3. **One atomic commit per task** — Conventional commits, verified by scripts, never batched

### The Loop

```
Specify → (Design) → (Tasks) → Execute → Review → Commit
```

- **Specify**: Write testable requirements in EARS notation with traceable IDs (e.g., `AUTH-01`)
- **Design**: Skipped for medium-scope features (auto-sized by the agent)
- **Tasks**: Skipped when steps are obvious (<5 steps)
- **Execute**: Implement one task at a time, verify with tests, commit atomically
- **Review**: Code review against standards and spec, refactor if needed

### Agent Skills

This project uses specialized AI skills loaded into the agent:

| Skill | Purpose |
|-------|---------|
| `tlc-spec-driven` | 4-phase spec-driven development workflow |
| `code-review` | Two-axis review (Standards + Spec) with Fowler smell baseline |
| `grill-me` | Challenge assumptions, ask the right questions |

Skills are installed via:
```bash
npx @tech-leads-club/agent-skills install --force --skill tlc-spec-driven
npx skills@latest add mattpocock/skills --skill=grill-me --agent '*' -y
```

## Rules

These rules are enforced by the AI agents, not just documented:

### Code Style
- Arrow functions as default
- No semicolons
- Single quotes
- Trailing commas
- 80 char line width

### Git Conventions
- Conventional commits: `feat(auth):`, `fix(api):`, `chore:`, `refactor:`
- One atomic commit per task
- Never commit secrets or API keys
- Commit messages validated by `check_commit.py` before every commit

### Testing
- Tests derive from spec acceptance criteria (never mirror implementation)
- Gate must pass (tests pass) before a task is done
- Never weaken, skip, or delete tests to make them pass
- Unit tests: `npm test`
- E2E tests: `npx playwright test`

### Spec-Driven Development
- Specs live in `.specs/features/[feature]/spec.md`
- Every requirement gets a unique ID (`AUTH-01`, `AUTH-02`, etc.)
- Acceptance criteria use EARS notation (WHEN/THEN, IF/THEN, WHILE)
- Traceability matrix tracks requirement → task → verification

## Architecture

```
src/
├── features/
│   ├── auth/               # Authentication feature
│   │   ├── components/     # AuthPage, LoginForm, SignupForm, Dashboard
│   │   ├── hooks/          # useAuthRedirect
│   │   ├── pages/          # SignInPage, SignUpPage, DashboardPage
│   │   └── index.ts        # Barrel export
│   └── movies/             # Movies feature
│       ├── components/     # MovieGrid, SearchBar, GenreFilter, etc.
│       ├── services/       # React Query hooks (useTrending, useSearch, useGenres)
│       ├── types/          # TypeScript interfaces
│       └── pages/          # HomePage, SearchPage
├── components/ui/          # Shadcn UI components (Button, Card, Input, etc.)
├── lib/                    # Shared utilities (axios client, cn helper)
├── schemas/                # Zod validation schemas
├── env.ts                  # Environment variable validation
└── utils/                  # Auth utilities (session storage)
```

### Tech Stack

- **React 19** + **TypeScript 6**
- **Vite 8** + **Tailwind CSS 4**
- **Shadcn UI** for components
- **React Query** (TanStack Query) for server state
- **React Router** for navigation
- **Zod** for schema validation
- **Vitest** for unit/integration tests
- **Playwright** for e2e tests

### Auth Flow

```
/ (no session) → /auth/login
/ (has session) → HomePage
/auth           → /auth/login
/auth/login     → / (if logged in)
/auth/signup    → / (if logged in)
/auth/dashboard → /auth/login (if no session)
Sign Out        → /auth/login
```

## Spec Structure

```
.specs/
├── STATE.md                    # Project decisions log
├── LESSONS.md                  # Self-improving lessons
└── features/
    └── auth-flow/
        ├── spec.md             # Requirements with EARS acceptance criteria
        ├── context.md          # User decisions (when discuss is triggered)
        ├── design.md           # Architecture (for large/complex features)
        ├── tasks.md            # Atomic tasks with verification
        └── validation.md       # Verifier report (PASS/FAIL)
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your TMDB API key to .env

# Run dev server
npm run dev

# Run tests
npm test

# Run build
npm run build
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_TMDB_API_KEY` | Yes | TMDB API key for movie data |

Validated at startup with Zod — the app won't start if required vars are missing.

## Git History

Every commit follows conventional commits and maps to a spec requirement:

```
de33117 refactor(auth): consolidate auth redirect logic and deduplicate pages
50d4019 chore: add agent skills to gitignore and update spec
a9b98cc feat(auth): redirect logged-in users from auth pages to home
3d3cae4 feat(auth): add auth flow routing with protected routes
ee9e653 feat(auth): add protected route wrapper
22c0d12 feat: add sign-in and sign-up pages with proper routing
8e6b3e6 chore: add env validation with zod and fix tsconfig deprecation
91dafbd feat: wire movies feature with routing and add check-types script
b9bc358 chore: initial project setup with auth and movies features
```

## License

MIT
