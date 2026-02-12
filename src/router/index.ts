import { createRouter, createWebHistory } from 'vue-router'

// Routes are lazy-loaded (dynamic imports) so each view is only fetched when the user navigates to it.

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'user-list',
      component: () => import('@/views/user-list.vue'),
    },
    {
      path: '/create-user',
      name: 'create-user',
      component: () => import('@/views/create-user.vue'),
    },
  ],
})

export default router
