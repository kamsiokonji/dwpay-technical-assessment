// Shared type definitions for the User domain.
// Kept in a dedicated types folder so they can be imported
// by stores, API layer, and components without circular deps.

export type UserRole = 'Admin' | 'Editor' | 'Viewer'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}
