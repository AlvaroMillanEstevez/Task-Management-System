<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <div class="flex flex-wrap items-center gap-4">
      <!-- Status Filter -->
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-700">Status:</label>
        <select 
          v-model="localFilters.status" 
          @change="emitFilters"
          class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <!-- Priority Filter -->
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-700">Priority:</label>
        <select 
          v-model="localFilters.priority" 
          @change="emitFilters"
          class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">Show overdue only</span>
        </label>
      </div>

      <!-- Search Input -->
      <div class="flex items-center space-x-2 flex-1 max-w-xs">
        <label class="text-sm font-medium text-gray-700">Search:</label>
        <input 
          v-model="localFilters.search"
          @input="emitFilters"
          type="text" 
          placeholder="Search tasks..."
          class="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
      </div>

      <!-- Clear Filters Button -->
      <button 
        @click="clearFilters"
        v-if="hasActiveFilters"
        class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        Clear All
      </button>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="mt-3 flex flex-wrap gap-2">
      <span v-if="localFilters.status" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
        Status: {{ formatStatus(localFilters.status) }}
        <button @click="clearFilter('status')" class="ml-1.5 text-indigo-600 hover:text-indigo-800">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </span>
      
      <span v-if="localFilters.priority" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
        Priority: {{ localFilters.priority.toUpperCase() }}
        <button @click="clearFilter('priority')" class="ml-1.5 text-indigo-600 hover:text-indigo-800">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </span>
      
      <span v-if="localFilters.overdue" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Overdue Only
        <button @click="clearFilter('overdue')" class="ml-1.5 text-red-600 hover:text-red-800">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </span>
      
      <span v-if="localFilters.search" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Search: "{{ localFilters.search }}"
        <button @click="clearFilter('search')" class="ml-1.5 text-gray-600 hover:text-gray-800">
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