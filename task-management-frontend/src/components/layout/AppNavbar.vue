<template>
  <nav class="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen fixed left-0 top-0 z-50">
    <div class="p-6">
      <!-- Logo -->
      <div class="flex items-center mb-8">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h1 class="ml-3 text-xl font-bold text-gray-900">TaskManager</h1>
      </div>
      
      <!-- Navigation Links -->
      <nav class="space-y-2">
        <router-link
          to="/dashboard"
          class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600': $route.name === 'Dashboard' }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
          </svg>
          Dashboard
        </router-link>

        <router-link
          to="/tasks"
          class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600': $route.name === 'Tasks' }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
          Tasks
        </router-link>

        <router-link
          to="/profile"
          class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600': $route.name === 'Profile' }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Profile
        </router-link>
      </nav>

      <!-- User Info & Logout -->
      <div class="mt-auto pt-6 border-t border-gray-200">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
            {{ authStore.currentUser?.name?.charAt(0).toUpperCase() }}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">{{ authStore.currentUser?.name }}</p>
            <p class="text-xs text-gray-500">{{ authStore.currentUser?.email }}</p>
          </div>
        </div>
        
        <button
          @click="handleLogout"
          class="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>