import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.fill('input[id="name"]', 'John')
    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('user can fill and submit login form', async ({ page }) => {
    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByText(/hello/i)).toBeVisible()
  })

  test('invalid credentials show error', async ({ page }) => {
    await page.fill('input[id="email"]', 'wrong@test.com')
    await page.fill('input[id="password"]', 'wrongpass')
    await page.click('button[type="submit"]')
    await expect(page.getByText('Invalid email or password')).toBeVisible()
  })

  test('successful login redirects to dashboard', async ({ page }) => {
    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByText(/hello/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible()
  })

  test('dashboard shows user greeting', async ({ page }) => {
    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByText('John')).toBeVisible()
  })
})
