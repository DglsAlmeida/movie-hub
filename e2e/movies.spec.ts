import { test, expect, type Page, type Route } from '@playwright/test'

const MOCK_MOVIES = [
  {
    id: 1,
    title: 'Mock Action Movie',
    overview: 'Overview',
    poster_path: '/poster1.jpg',
    backdrop_path: '/backdrop1.jpg',
    release_date: '2024-01-01',
    vote_average: 8.0,
    vote_count: 100,
    genre_ids: [28],
    popularity: 50,
    adult: false,
    original_language: 'en',
    original_title: 'Mock Action Movie',
    video: false,
  },
  {
    id: 2,
    title: 'Mock Comedy Movie',
    overview: 'Overview',
    poster_path: '/poster2.jpg',
    backdrop_path: '/backdrop2.jpg',
    release_date: '2024-02-01',
    vote_average: 7.0,
    vote_count: 80,
    genre_ids: [35],
    popularity: 40,
    adult: false,
    original_language: 'en',
    original_title: 'Mock Comedy Movie',
    video: false,
  },
]

const MOCK_GENRES = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
]

const mockTrending = { page: 1, results: MOCK_MOVIES, total_pages: 1, total_results: 2 }
const mockGenres = { genres: MOCK_GENRES }
const mockSearchAction = {
  page: 1,
  results: [MOCK_MOVIES[0]],
  total_pages: 1,
  total_results: 1,
}

interface ApiBehavior {
  trendingStatus?: number
  searchStatus?: number
}

const fulfill = (
  route: Route,
  status: number,
  body: unknown,
) => {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  })
}

const mockMovieApi = (page: Page, behavior: ApiBehavior = {}) => {
  return Promise.all([
    page.route('**/trending/movie/week**', (route) =>
      fulfill(
        route,
        behavior.trendingStatus ?? 200,
        behavior.trendingStatus ? {} : mockTrending,
      ),
    ),
    page.route('**/genre/movie/list**', (route) =>
      fulfill(route, 200, mockGenres),
    ),
    page.route('**/search/movie**', (route) =>
      fulfill(
        route,
        behavior.searchStatus ?? 200,
        behavior.searchStatus ? {} : mockSearchAction,
      ),
    ),
  ])
}

const seedSession = (page: Page) => {
  return page.addInitScript(() => {
    sessionStorage.setItem(
      'auth_session',
      JSON.stringify({ name: 'John', email: 'john@test.com' }),
    )
  })
}

test.beforeEach(async ({ page }) => {
  await seedSession(page)
})

test.describe('MovieHub home page', () => {
  test('renders trending movies and layout', async ({ page }) => {
    await mockMovieApi(page)
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'MovieHub' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Trending This Week' }),
    ).toBeVisible()
    await expect(page.getByText('Mock Action Movie')).toBeVisible()
    await expect(page.getByText('Mock Comedy Movie')).toBeVisible()
    await expect(page.getByPlaceholder('Search movies...')).toBeVisible()
  })

  test('renders genre filters', async ({ page }) => {
    await mockMovieApi(page)
    await page.goto('/')
    await expect(
      page.getByRole('checkbox', { name: 'Action genre' }),
    ).toBeVisible()
    await expect(
      page.getByRole('checkbox', { name: 'Comedy genre' }),
    ).toBeVisible()
  })

  test('filters the grid when a genre is selected', async ({ page }) => {
    await mockMovieApi(page)
    await page.goto('/')
    await page.getByRole('checkbox', { name: 'Action genre' }).click()
    await expect(page.getByText('Mock Action Movie')).toBeVisible()
    await expect(page.getByText('Mock Comedy Movie')).toBeHidden()
  })

  test('switches to search results when typing and clears them', async ({
    page,
  }) => {
    await mockMovieApi(page)
    await page.goto('/')
    await page.getByPlaceholder('Search movies...').fill('Action')
    await expect(
      page.getByRole('heading', { name: 'Search Results' }),
    ).toBeVisible()
    await expect(page.getByText('Mock Action Movie')).toBeVisible()
    await expect(page.getByText('Mock Comedy Movie')).toBeHidden()
    await page.getByPlaceholder('Search movies...').fill('')
    await expect(
      page.getByRole('heading', { name: 'Trending This Week' }),
    ).toBeVisible()
  })

  test('shows shared error state when the API fails and recovers on retry', async ({
    page,
  }) => {
    await mockMovieApi(page, { trendingStatus: 500 })
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: 'Something went wrong' }),
    ).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Try again')).toBeVisible()
  })
})

test.describe('MovieHub search page', () => {
  test('performs a search and renders result count', async ({ page }) => {
    await mockMovieApi(page)
    await page.goto('/search')
    await expect(
      page.getByRole('heading', { name: 'Search Movies' }),
    ).toBeVisible()
    await page.getByPlaceholder('Search movies...').fill('Action')
    await expect(page.getByText('Found 1 results for "Action"')).toBeVisible()
    await expect(page.getByText('Mock Action Movie')).toBeVisible()
  })

  test('shows empty state before typing', async ({ page }) => {
    await mockMovieApi(page)
    await page.goto('/search')
    await expect(
      page.getByText('Start typing to search for movies'),
    ).toBeVisible()
  })

  test('shows shared error state when search fails', async ({ page }) => {
    await mockMovieApi(page, { searchStatus: 500 })
    await page.goto('/search')
    await page.getByPlaceholder('Search movies...').fill('Action')
    await expect(
      page.getByRole('heading', { name: 'Something went wrong' }),
    ).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Try again')).toBeVisible()
  })
})

test.describe('MovieHub navigation', () => {
  test('search page links back to home', async ({ page }) => {
    await mockMovieApi(page)
    await page.goto('/search')
    await page.getByRole('button', { name: 'Back to Home' }).click()
    await expect(page.getByRole('heading', { name: 'MovieHub' })).toBeVisible()
  })
})