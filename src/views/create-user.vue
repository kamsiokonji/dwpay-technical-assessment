<script setup lang="ts">
// Create User view — handles form state, validation, and submission.
// Validation is performed client-side before calling the store action to give instant feedback to the user.

import { useUserStore } from '@/stores/users'
import type { UserRole } from '@/types/user'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUserStore()

// Form field refs — kept local to this view since they don't need to persist across navigations.
const name = ref('')
const email = ref('')
const role = ref<UserRole>('Viewer')

const { loading, error } = storeToRefs(userStore)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Reactive object for per-field inline error messages.
const validationErrors = reactive({
  name: '',
  email: '',
  role: '',
})

const createUser = async () => {
  validationErrors.name = ''
  validationErrors.email = ''
  validationErrors.role = ''

  if (!name.value) {
    validationErrors.name = 'Name is required'
  }

  if (!email.value) {
    validationErrors.email = 'Email is required'
  } else if (!emailRegex.test(email.value)) {
    // Only check format when a value is present, so the "required" message isn't overwritten by "invalid".
    validationErrors.email = 'Email is invalid'
  }

  if (validationErrors.name || validationErrors.email || validationErrors.role) {
    return
  }

  await userStore.addUser({
    id: Date.now(),
    name: name.value,
    email: email.value,
    role: role.value,
  })

  name.value = ''
  email.value = ''
  role.value = 'Viewer'

  router.push('/')
}
</script>

<template>
  <div class="create-user-container">
    <div class="create-user-header">
      <RouterLink to="/" class="back-button">Back</RouterLink>
      <h1>Create User</h1>
    </div>

    <form class="create-user-form" @submit.prevent="createUser">
      <label for="name"
        >Name

        <input
          id="name"
          type="text"
          v-model="name"
          placeholder="Name"
          :class="{ 'input-error': validationErrors.name }"
        />

        <div v-if="validationErrors.name" class="error-message">
          {{ validationErrors.name }}
        </div>
      </label>

      <label for="email"
        >Email
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="Email"
          :class="{ 'input-error': validationErrors.email }"
        />

        <div v-if="validationErrors.email" class="error-message">
          {{ validationErrors.email }}
        </div>
      </label>

      <label for="role"
        >Role
        <select id="role" v-model="role" :class="{ 'input-error': validationErrors.role }">
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>

        <div v-if="validationErrors.role" class="error-message">
          {{ validationErrors.role }}
        </div>
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Creating...' : 'Create User' }}
      </button>
    </form>

    <div v-if="error" class="error-message">Error: {{ error }}</div>
  </div>
</template>

<style scoped>
.create-user-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.create-user-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  padding: 8px 16px;
  background-color: #2563eb;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: #000;
}

.create-user-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.create-user-button {
  padding: 8px 16px;
  background-color: #2563eb;
  color: #fff;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-message {
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
}

.input-error {
  border-color: #dc2626;
}
</style>
