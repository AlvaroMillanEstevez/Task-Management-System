<template>
  <div class="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 p-4 transition-colors duration-300">
    <div class="flex flex-wrap items-center gap-4">
      <!-- Status Filter -->
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
        <select 
          v-model="localFilters.status" 
          @change="emitFilters"
          class="border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <!-- Priority Filter -->
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</label>
        <select 
          v-model="localFilters.priority" 
          @change="emitFilters"
          class="border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <!-- Overdue Filter -->
      <div class="flex items-center space-x-2">
        <label class="flex items-center">
          <input 
            type="checkbox" 
            v-model="localFilters.overdue" 
            @change="emitFilters"
            class="rounded border-gray-300 dark:border-dark-600 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-dark-700 dark:focus:ring-indigo-600"
          >
          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Show overdue only</span>
        </label>
      </div>

      <!-- Search Input -->
      <div class="flex items-center space-x-2 flex-1 max-w-xs">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Search:</label>
        <input 
          v-model="localFilters.search"
          @input="emitFilters"
          type="text" 
          placeholder="Search tasks..."
          class="flex-1 border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
        >
      </div>

      <!-- Clear Filters Button -->
      <button 
        @click="clearFilters"
        v-if="hasActiveFilters"
        class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
      >
        Clear All
      </button>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="mt-3 flex flex-wrap gap-2">
      <span v-if="localFilters.status" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
        Status: {{ formatStatus(localFilters.status) }}
        <button @click="clearFilter('status')" class="ml-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </span>
      
      <span v-if="localFilters.priority" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
        Priority: {{ localFilters.priority.toUpperCase() }}
        <button @click="clearFilter('priority')" class="ml-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </span>
      
      <span v-if="localFilters.overdue" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
        Overdue Only
        <button @click="clearFilter('overdue')" class="ml-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </span>
      
      <span v-if="localFilters.search" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
        Search: "{{ localFilters.search }}"
        <button @click="clearFilter('search')" class="ml-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['filter-change'])

const localFilters = ref({
  status: '',
  priority: '',
  overdue: false,
  search: ''
})

const hasActiveFilters = computed(() => {
  return localFilters.value.status || 
         localFilters.value.priority || 
         localFilters.value.overdue ||
         localFilters.value.search
})

const formatStatus = (status) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const emitFilters = () => {
  emit('filter-change', { ...localFilters.value })
}

const clearFilters = () => {
  localFilters.value = {
    status: '',
    priority: '',
    overdue: false,
    search: ''
  }
  emitFilters()
}

const clearFilter = (filterName) => {
  if (filterName === 'overdue') {
    localFilters.value[filterName] = false
  } else {
    localFilters.value[filterName] = ''
  }
  emitFilters()
}
</script>
