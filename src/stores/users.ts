// Centralises all user state so it persists across route navigations
// (the store instance lives outside any component lifecycle).

import { defineStore } from 'pinia'
import { getUsers, createUser } from '../api/users'
import type { User } from '@/types/user'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // Computed property that automatically updates whenever the users array changes.
    adminCount: (state) => state.users.filter((u) => u.role === 'Admin').length,
  },

  actions: {
    async fetchUsers() {
      // Skip refetch if users are already loaded to avoid a loading flicker when navigating back to the list view.
      if (this.users.length > 0) return

      this.loading = true
      this.error = null

      try {
        this.users = await getUsers()
      } catch (err) {
        this.error = 'Failed to fetch users'
      } finally {
        this.loading = false
      }
    },

    async addUser(user: User) {
      // Optimistic update: push the user into the list immediately
      // so the UI feels instant, then confirm with the API in the background.
      const tempId = Date.now()
      const tempUser = { ...user, id: tempId }
      this.users.push(tempUser)

      try {
        // No loading flag here because the optimistic update already reflects the change, so we don't want to show a spinner.
        await createUser(user)
      } catch (err) {
        // Rollback the optimistic update if the API call fails.
        this.users = this.users.filter((u) => u.id !== tempId)
        this.error = 'Failed to create user'
      }
    },
  },
})
