import { test, expect } from '@playwright/test'

test.describe('Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth')
  })

  test('user can fill and submit signup form', async ({ page }) => {
    await page.fill('input[id="name"]', 'John Doe')
    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('validation errors display for invalid input', async ({ page }) => {
    await page.click('button[type="submit"]')
    await expect(page.getByText('Name is required')).toBeVisible()
    await expect(page.getByText('Email is required')).toBeVisible()
    await expect(page.getByText('Password is required')).toBeVisible()
  })

  test('successful signup redirects to login', async ({ page }) => {
    await page.fill('input[id="name"]', 'John Doe')
    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('duplicate email shows error', async ({ page }) => {
    await page.fill('input[id="name"]', 'John Doe')
    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await page.click('button:has-text("Sign Up")')
    await page.fill('input[id="name"]', 'Jane Doe')
    await page.fill('input[id="email"]', 'john@test.com')
    await page.fill('input[id="password"]', 'password456')
    await page.click('button[type="submit"]')
    await expect(page.getByText('Email already exists')).toBeVisible()
  })
})
