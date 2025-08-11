<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p class="text-gray-600 mt-1">Manage and organize your tasks</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        New Task
      </button>
    </div>

    <!-- Filters -->
    <TaskFilters @filter-change="handleFilterChange" />

    <!-- Tasks List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="px-6 py-4 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            Tasks ({{ tasksStore.filteredTasks.length }})
          </h2>
          <button 
            @click="tasksStore.clearFilters()"
            v-if="hasActiveFilters"
            class="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div class="p-6">
        <!-- Loading State -->
        <div v-if="tasksStore.loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="text-gray-500 mt-2">Loading tasks...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="tasksStore.filteredTasks.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet' }}
          </h3>
          <p class="text-gray-500 mb-4">
            {{ hasActiveFilters ? 'Try adjusting your search criteria' : 'Create your first task to get started!' }}
          </p>
          <button 
            v-if="!hasActiveFilters"
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create Task
          </button>
        </div>

        <!-- Tasks Grid -->
        <div v-else class="space-y-4">
          <TaskCard 
            v-for="task in tasksStore.filteredTasks" 
            :key="task.id" 
            :task="task"
            @edit="handleEditTask"
            @delete="handleDeleteTask"
            @status-change="handleStatusChange"
          />
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <TaskModal 
      v-if="showCreateModal || editingTask"
      :task="editingTask"
      @close="closeModal"
      @save="handleSaveTask"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskFilters from '@/components/tasks/TaskFilters.vue'
import TaskModal from '@/components/tasks/TaskModal.vue'

const tasksStore = useTasksStore()

const showCreateModal = ref(false)
const editingTask = ref(null)

const hasActiveFilters = computed(() => {
  return tasksStore.filters.status || 
         tasksStore.filters.priority || 
         tasksStore.filters.overdue
})

const handleFilterChange = (filters) => {
  tasksStore.setFilters(filters)
}

const handleEditTask = (task) => {
  editingTask.value = task
}

const handleDeleteTask = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await tasksStore.deleteTask(taskId)
  }
}

const handleStatusChange = async (taskId, newStatus) => {
  await tasksStore.updateTask(taskId, { status: newStatus })
}

const handleSaveTask = async (taskData) => {
  let result
  if (editingTask.value) {
    result = await tasksStore.updateTask(editingTask.value.id, taskData)
  } else {
    result = await tasksStore.createTask(taskData)
  }
  
  if (result.success) {
    closeModal()
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingTask.value = null
}

onMounted(() => {
  tasksStore.fetchTasks()
})
</script>