<script setup lang="ts">
// App shell — provides the persistent layout (header) while RouterView swaps the page content based on the current route.
import LayoutHeader from '@/components/layout-header.vue'
import '@/index.css'
</script>

<template>
  <div class="container">
    <LayoutHeader />
    <!-- RouterView renders the matched route component -->
    <RouterView />
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
