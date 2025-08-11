<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
      <p class="text-gray-600 mt-1">Manage your account settings</p>
    </div>

    <!-- Profile Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Cover -->
      <div class="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      
      <!-- Profile Info -->
      <div class="px-6 py-6">
        <div class="flex items-center -mt-16 mb-6">
          <div class="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
            <div class="w-full h-full bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {{ authStore.currentUser?.name?.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="ml-6 pt-16">
            <h2 class="text-2xl font-bold text-gray-900">{{ authStore.currentUser?.name }}</h2>
            <p class="text-gray-600">{{ authStore.currentUser?.email }}</p>
            <div class="flex items-center mt-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg class="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3"/>
                </svg>
                Active
              </span>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ tasksStore.tasksByStatus.total }}</div>
            <div class="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ tasksStore.tasksByStatus.completed }}</div>
            <div class="text-sm text-gray-600">Completed</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">{{ tasksStore.tasksByStatus.pending }}</div>
            <div class="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        <!-- Account Information -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {{ authStore.currentUser?.name }}
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {{ authStore.currentUser?.email }}
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {{ formatDate(authStore.currentUser?.created_at) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="border-t border-gray-200 pt-6 mt-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Edit Profile
            </button>
            <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Change Password
            </button>
            <button 
              @click="handleLogout"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'

const router = useRouter()
const authStore = useAuthStore()
const tasksStore = useTasksStore()

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  if (tasksStore.tasks.length === 0) {
    tasksStore.fetchTasks()
  }
})
</script>