<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <AppNavbar v-if="authStore.isAuthenticated" />
    
    <!-- Main Content -->
    <main :class="{ 'ml-64': authStore.isAuthenticated, 'ml-0': !authStore.isAuthenticated }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/layout/AppNavbar.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Fetch user data if authenticated
  if (authStore.isAuthenticated) {
    authStore.fetchUser()
  }
})
</script>