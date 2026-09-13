import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveUser,
  getUser,
  getUsers,
  saveSession,
  getSession,
  clearSession,
} from './auth'

describe('Auth Utils', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  describe('saveUser', () => {
    it('saves user to sessionStorage', () => {
      saveUser({ name: 'John', email: 'john@test.com', password: 'pass123' })
      const users = getUsers()
      expect(users).toHaveLength(1)
      expect(users[0].email).toBe('john@test.com')
    })

    it('appends multiple users', () => {
      saveUser({ name: 'John', email: 'john@test.com', password: 'pass123' })
      saveUser({ name: 'Jane', email: 'jane@test.com', password: 'pass456' })
      expect(getUsers()).toHaveLength(2)
    })
  })

  describe('getUser', () => {
    it('finds user by email', () => {
      saveUser({ name: 'John', email: 'john@test.com', password: 'pass123' })
      const user = getUser('john@test.com')
      expect(user).toBeDefined()
      expect(user?.name).toBe('John')
    })

    it('returns undefined for non-existent email', () => {
      expect(getUser('nonexistent@test.com')).toBeUndefined()
    })
  })

  describe('getUsers', () => {
    it('returns empty array when no users', () => {
      expect(getUsers()).toEqual([])
    })

    it('returns all saved users', () => {
      saveUser({ name: 'John', email: 'john@test.com', password: 'pass123' })
      saveUser({ name: 'Jane', email: 'jane@test.com', password: 'pass456' })
      expect(getUsers()).toHaveLength(2)
    })
  })

  describe('saveSession', () => {
    it('saves session to sessionStorage', () => {
      saveSession({ name: 'John', email: 'john@test.com' })
      const session = getSession()
      expect(session).toBeDefined()
      expect(session?.email).toBe('john@test.com')
    })
  })

  describe('getSession', () => {
    it('returns null when no session', () => {
      expect(getSession()).toBeNull()
    })

    it('returns saved session', () => {
      saveSession({ name: 'John', email: 'john@test.com' })
      const session = getSession()
      expect(session?.name).toBe('John')
    })
  })

  describe('clearSession', () => {
    it('removes session from sessionStorage', () => {
      saveSession({ name: 'John', email: 'john@test.com' })
      clearSession()
      expect(getSession()).toBeNull()
    })
  })
})
