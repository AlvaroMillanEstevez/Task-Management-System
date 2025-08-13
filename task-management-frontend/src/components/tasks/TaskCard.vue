<template>
  <div class="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4 hover:shadow-md dark:hover:shadow-dark-900/50 transition-all duration-300">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <!-- Title and Description -->
        <div class="mb-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{{ task.title }}</h3>
          <p v-if="task.description" class="text-gray-600 dark:text-gray-400 text-sm">{{ task.description }}</p>
        </div>
        
        <!-- Badges -->
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <!-- Status Badge -->
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="statusClasses">
            <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="statusDotClasses"></span>
            {{ formatStatus(task.status) }}
          </span>
          
          <!-- Priority Badge -->
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="priorityClasses">
            {{ task.priority.toUpperCase() }}
          </span>
          
          <!-- Due Date Badge -->
          <span v-if="task.due_date" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="dueDateClasses">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ formatDate(task.due_date) }}
          </span>
        </div>
      </div>

      <!-- Actions Menu -->
      <div v-if="showActions !== false" class="relative ml-4">
        <button 
          @click="showDropdown = !showDropdown"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
        >
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 z-10">
          <div class="py-1">
            <!-- Status Actions -->
            <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-dark-700">
              Change Status
            </div>
            <button 
              @click="changeStatus('pending')"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center transition-colors"
            >
              <span class="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
              Pending
            </button>
            <button 
              @click="changeStatus('in_progress')"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center transition-colors"
            >
              <span class="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              In Progress
            </button>
            <button 
              @click="changeStatus('completed')"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center transition-colors"
            >
              <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Completed
            </button>
            
            <!-- Divider -->
            <div class="border-t border-gray-100 dark:border-dark-700 my-1"></div>
            
            <!-- Edit/Delete Actions -->
            <button 
              @click="editTask"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center transition-colors"
            >
              <svg class="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Task
            </button>
            <button 
              @click="deleteTask"
              class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors"
            >
              <svg class="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Status Change Buttons (for dashboard) -->
    <div v-if="showActions === false" class="flex gap-2 mt-3">
      <button 
        v-if="task.status !== 'completed'"
        @click="changeStatus('completed')"
        class="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-900/70 transition-colors"
      >
        Mark Complete
      </button>
      <button 
        v-if="task.status === 'pending'"
        @click="changeStatus('in_progress')"
        class="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors"
      >
        Start Working
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['edit', 'delete', 'status-change'])

const showDropdown = ref(false)

const statusClasses = computed(() => {
  const classes = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
    in_progress: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
    completed: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
  }
  return classes[props.task.status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
})

const statusDotClasses = computed(() => {
  const classes = {
    pending: 'bg-yellow-400',
    in_progress: 'bg-blue-400',
    completed: 'bg-green-400'
  }
  return classes[props.task.status] || 'bg-gray-400'
})

const priorityClasses = computed(() => {
  const classes = {
    low: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
    medium: 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300',
    high: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
  }
  return classes[props.task.priority] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
})

const dueDateClasses = computed(() => {
  if (!props.task.due_date) return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
  
  const today = new Date().toISOString().split('T')[0]
  const dueDate = props.task.due_date
  
  if (dueDate < today && props.task.status !== 'completed') {
    return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
  } else if (dueDate === today) {
    return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
  } else {
    return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
  }
})

const formatStatus = (status) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDate = (date) => {
  if (!date) return ''
  const today = new Date().toISOString().split('T')[0]
  const taskDate = new Date(date)
  
  if (date === today) {
    return 'Today'
  } else if (date < today) {
    return 'Overdue'
  } else {
    return taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

const changeStatus = (newStatus) => {
  emit('status-change', props.task.id, newStatus)
  showDropdown.value = false
}

const editTask = () => {
  emit('edit', props.task)
  showDropdown.value = false
}

const deleteTask = () => {
  emit('delete', props.task.id)
  showDropdown.value = false
}
</script>