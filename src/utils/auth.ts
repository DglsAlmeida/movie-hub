export interface User {
  name: string
  email: string
  password: string
}

export interface Session {
  name: string
  email: string
}

const USERS_KEY = 'auth_users'
const SESSION_KEY = 'auth_session'

export const saveUser = (user: User): void => {
  const users = getUsers()
  users.push(user)
  sessionStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const getUser = (email: string): User | undefined => {
  const users = getUsers()
  return users.find((u) => u.email === email)
}

export const getUsers = (): User[] => {
  const data = sessionStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

export const saveSession = (session: Session): void => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const getSession = (): Session | null => {
  const data = sessionStorage.getItem(SESSION_KEY)
  return data ? JSON.parse(data) : null
}

export const clearSession = (): void => {
  sessionStorage.removeItem(SESSION_KEY)
}
