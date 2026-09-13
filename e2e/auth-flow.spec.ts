import { test, expect } from '@playwright/test'

test.describe('Auth Flow', () => {
  test('complete signup → login → dashboard flow', async ({ page }) => {
    await page.goto('/')

    await page.fill('input[id="name"]', 'John Doe')
    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/hello/i)).toBeVisible()
    await expect(page.getByText('John')).toBeVisible()
  })

  test('sign out returns to login', async ({ page }) => {
    await page.goto('/')

    await page.fill('input[id="name"]', 'John Doe')
    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.click('button:has-text("Sign Out")')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('session persists on page refresh', async ({ page }) => {
    await page.goto('/')

    await page.fill('input[id="name"]', 'John Doe')
    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.reload()
    await expect(page.getByText(/hello/i)).toBeVisible()
    await expect(page.getByText('John')).toBeVisible()
  })
})
