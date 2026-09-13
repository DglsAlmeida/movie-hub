# Auth Flow Specification

## Problem Statement

Users can access all routes (/, /search, /auth) regardless of authentication state. There is no guard preventing unauthenticated users from viewing protected content, and no redirect sending logged-out users to sign in. The app needs a clean auth flow: check session on load, redirect accordingly.

## Goals

- [ ] Unauthenticated users are redirected to /auth/login when accessing protected routes
- [ ] Authenticated users land on the movie homepage (/) by default
- [ ] The /auth route redirects to /auth/login

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real backend auth | Using sessionStorage for now |
| Password reset | Not in scope |
| Remember me / persistent login | Session-only auth |
| Role-based access control | Single user role |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
|----------------------|---------------|-----------|------------|
| Which routes are protected? | /, /search, /auth/dashboard | These show user-specific or app content | y |
| Where do logged-in users land? | / (movie homepage) | Main app experience | y |
| What does /auth redirect to? | /auth/login | Login is the default auth view | y |
| How is auth state checked? | getSession() from sessionStorage | Existing utility, no changes needed | y |

**Open questions:** none - all resolved above.

---

## User Stories

### P1: Auth Redirect on App Load ⭐ MVP

**User Story**: As a visitor, I want the app to check my login state on load so that I'm routed to the right place.

**Why P1**: Core navigation flow — without it, unauthenticated users see protected content.

**Acceptance Criteria**:

1. WHEN user navigates to / AND has no session THEN the system SHALL redirect to /auth/login <!-- event-driven -->
2. WHEN user navigates to / AND has a valid session THEN the system SHALL render the HomePage <!-- event-driven -->
3. WHEN user navigates to /search AND has no session THEN the system SHALL redirect to /auth/login <!-- event-driven -->
4. WHEN user navigates to /search AND has a valid session THEN the system SHALL render the SearchPage <!-- event-driven -->
5. WHEN user navigates to /auth THEN the system SHALL redirect to /auth/login <!-- event-driven -->
6. WHEN user navigates to /auth/login AND has a valid session THEN the system SHALL redirect to / <!-- unwanted-behavior (logged-in user on auth page) -->
7. WHEN user navigates to /auth/signup AND has a valid session THEN the system SHALL redirect to / <!-- unwanted-behavior -->
8. WHEN user navigates to /auth/dashboard AND has no session THEN the system SHALL redirect to /auth/login <!-- event-driven -->

**Independent Test**: Can demo by visiting / in a browser with no session — should redirect to /auth/login. After logging in, should land on /.

---

### P2: Sign Out Redirects to Login

**User Story**: As a logged-in user, I want to be redirected to /auth/login when I sign out.

**Why P2**: Completes the auth cycle — sign out should return to the login screen.

**Acceptance Criteria**:

1. WHEN user clicks Sign Out AND is on /auth/dashboard THEN the system SHALL clear the session AND redirect to /auth/login <!-- event-driven -->

**Independent Test**: Log in, navigate to dashboard, click Sign Out — should redirect to /auth/login.

---

## Edge Cases

- IF session storage is cleared externally (e.g., manual browser action) THEN the system SHALL redirect to /auth/login on next navigation <!-- IF/THEN -->
- WHEN user has a session AND navigates to /auth/login THEN the system SHALL redirect to / (prevent logged-in user from seeing auth pages) <!-- WHILE -->

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|---------------|-------|-------|--------|
| AUTH-01 | P1: Auth Redirect on App Load | Verified | Complete |
| AUTH-02 | P1: Auth Redirect on App Load | Verified | Complete |
| AUTH-03 | P1: Auth Redirect on App Load | Verified | Complete |
| AUTH-04 | P1: Auth Redirect on App Load | Verified | Complete |
| AUTH-05 | P1: Auth Redirect on App Load | Verified | Complete |
| AUTH-06 | P1: Auth Redirect on App Load | Verified | Complete |
| AUTH-07 | P1: Auth Redirect on App Load | Verified | Complete |
| AUTH-08 | P1: Auth Redirect on App Load | Verified | Complete |
| AUTH-09 | P2: Sign Out Redirect | Implementing | In Progress |

**Coverage:** 9 total, 0 mapped to tasks, 9 unmapped

---

## Success Criteria

- [ ] Visiting / with no session redirects to /auth/login
- [ ] Visiting / with a session shows the HomePage
- [ ] /auth redirects to /auth/login
- [ ] Logged-in users on auth pages are redirected to /
- [ ] Sign out returns to /auth/login
