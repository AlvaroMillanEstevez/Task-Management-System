<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
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
import { useThemeStore } from '@/stores/theme'
import AppNavbar from '@/components/layout/AppNavbar.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()

onMounted(() => {
  // Initialize theme on app load
  themeStore.initTheme()
  
  // Fetch user data if authenticated
  if (authStore.isAuthenticated) {
    authStore.fetchUser()
  }
})
</script>