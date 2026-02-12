<script setup lang="ts">
// User List view — displays all users with search filtering.
// Uses storeToRefs so that Pinia state/getters stay reactive after destructuring (plain destructure would lose reactivity).

import SearchInput from '@/components/search-input.vue'
import { useUserStore } from '@/stores/users'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

const search = ref('')

const userStore = useUserStore()
const { users, loading, error } = storeToRefs(userStore)

// Fetch users on mount; the store guards against redundant refetches.
onMounted(() => {
  userStore.fetchUsers()
})

// Case-insensitive search computed — recalculates automatically when either the search query or the users array changes.
const filteredUsers = computed(() =>
  users.value.filter((user) => user.name.toLowerCase().includes(search.value.toLowerCase())),
)
</script>

<template>
  <div class="user-list-container">
    <div class="user-list">
      <div class="user-list-header">
        <h1>Admin Users ({{ userStore.adminCount }})</h1>
      </div>
      <div class="card">
        <div class="card-header">
          <h1>User List</h1>

          <div class="card-header-actions">
            <SearchInput v-model="search" />
            <RouterLink to="/create-user" class="create-user-button">Create User</RouterLink>
          </div>
        </div>

        <div class="user-list-content">
          <div v-if="loading">Loading...</div>
          <div v-else-if="error">Error: {{ error }}</div>
          <div v-else-if="filteredUsers.length === 0">No users found</div>

          <div v-else class="user-list-items">
            <div v-for="user in filteredUsers" :key="user.id" class="user-list-item">
              <h2>{{ user.name }}</h2>
              <p>{{ user.email }}</p>
              <p>{{ user.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-list-container {
  padding: 16px;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: #000;
}

.card {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  align-items: center;
}

.create-user-button {
  padding: 8px 16px;
  background-color: #2563eb;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

.user-list-content {
  overflow-y: auto;
  flex: 1;
}

.user-list-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-list-item {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
}
</style>
