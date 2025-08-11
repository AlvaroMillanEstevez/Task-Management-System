<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          Welcome back, {{ authStore.currentUser?.name }}! 👋
        </h1>
        <p class="text-gray-600 mt-1">Here's an overview of your tasks</p>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-500">{{ currentDate }}</p>
        <p class="text-lg font-semibold text-gray-900">{{ currentTime }}</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Tasks -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Tasks</p>
            <p class="text-2xl font-bold text-gray-900">{{ tasksStore.tasksByStatus.total }}</p>
          </div>
        </div>
      </div>

      <!-- Pending Tasks -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-full">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <p class="text-2xl font-bold text-gray-900">{{ tasksStore.tasksByStatus.pending }}</p>
          </div>
        </div>
      </div>

      <!-- In Progress -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center">
          <div class="p-3 bg-orange-100 rounded-full">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">In Progress</p>
            <p class="text-2xl font-bold text-gray-900">{{ tasksStore.tasksByStatus.in_progress }}</p>
          </div>
        </div>
      </div>

      <!-- Completed -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Completed</p>
            <p class="text-2xl font-bold text-gray-900">{{ tasksStore.tasksByStatus.completed }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Completion Progress</h3>
        <span class="text-sm text-gray-500">{{ completionPercentage }}% complete</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div 
          class="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
          :style="{ width: completionPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Recent Tasks -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="px-6 py-4 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Recent Tasks</h2>
          <router-link 
            to="/tasks" 
            class="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            View All →
          </router-link>
        </div>
      </div>

      <div class="p-6">
        <div v-if="tasksStore.loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="text-gray-500 mt-2">Loading tasks...</p>
        </div>

        <div v-else-if="recentTasks.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p class="text-gray-500 mb-4">Create your first task to get started!</p>
          <router-link 
            to="/tasks" 
            class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create Task
          </router-link>
        </div>

        <div v-else class="space-y-4">
          <TaskCard 
            v-for="task in recentTasks" 
            :key="task.id" 
            :task="task"
            :show-actions="false"
            @status-change="handleStatusChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import TaskCard from '@/components/tasks/TaskCard.vue'

const authStore = useAuthStore()
const tasksStore = useTasksStore()

const currentDate = ref('')
const currentTime = ref('')

const recentTasks = computed(() => {
  return tasksStore.tasks.slice(0, 5)
})

const completionPercentage = computed(() => {
  const total = tasksStore.tasksByStatus.total
  if (total === 0) return 0
  return Math.round((tasksStore.tasksByStatus.completed / total) * 100)
})

const handleStatusChange = async (taskId, newStatus) => {
  await tasksStore.updateTask(taskId, { status: newStatus })
}

const updateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  currentTime.value = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

onMounted(() => {
  tasksStore.fetchTasks()
  updateTime()
  setInterval(updateTime, 60000) // Update every minute
})
</script>