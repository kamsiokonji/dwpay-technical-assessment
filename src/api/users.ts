// Mock API layer — isolated in its own module so it can be swapped
// for real HTTP calls (e.g. axios / fetch) without touching the store.
// Each function returns a Promise with a simulated network delay.

import type { User } from '@/types/user'

const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer' },
]

export function getUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockUsers]), 800)
  })
}

export function createUser(user: User): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = { ...user, id: Date.now() }
      mockUsers.push(newUser)
      resolve(newUser)
    }, 500)
  })
}
