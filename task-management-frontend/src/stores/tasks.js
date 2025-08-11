import { defineStore } from 'pinia'
import api from '@/services/api'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    categories: [],
    loading: false,
    error: null,
    filters: {
      status: '',
      priority: '',
      overdue: false
    }
  }),

  getters: {
    filteredTasks: (state) => {
      let filtered = [...state.tasks]

      if (state.filters.status) {
        filtered = filtered.filter(task => task.status === state.filters.status)
      }

      if (state.filters.priority) {
        filtered = filtered.filter(task => task.priority === state.filters.priority)
      }

      if (state.filters.overdue) {
        const today = new Date().toISOString().split('T')[0]
        filtered = filtered.filter(task => 
          task.due_date && task.due_date < today && task.status !== 'completed'
        )
      }

      return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },

    tasksByStatus: (state) => {
      return {
        pending: state.tasks.filter(task => task.status === 'pending').length,
        in_progress: state.tasks.filter(task => task.status === 'in_progress').length,
        completed: state.tasks.filter(task => task.status === 'completed').length,
        total: state.tasks.length
      }
    },

    overdueTasks: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.tasks.filter(task => 
        task.due_date && task.due_date < today && task.status !== 'completed'
      ).length
    }
  },

  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/tasks')
        if (response.data.success) {
          this.tasks = response.data.tasks
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch tasks'
      } finally {
        this.loading = false
      }
    },

    async createTask(taskData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/tasks', taskData)
        if (response.data.success) {
          this.tasks.unshift(response.data.task)
          return { success: true }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create task'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateTask(taskId, taskData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.put(`/tasks/${taskId}`, taskData)
        if (response.data.success) {
          const index = this.tasks.findIndex(task => task.id === taskId)
          if (index !== -1) {
            this.tasks[index] = response.data.task
          }
          return { success: true }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update task'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteTask(taskId) {
      this.loading = true
      this.error = null

      try {
        const response = await api.delete(`/tasks/${taskId}`)
        if (response.data.success) {
          this.tasks = this.tasks.filter(task => task.id !== taskId)
          return { success: true }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete task'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const response = await api.get('/categories')
        if (response.data.success) {
          this.categories = response.data.categories
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        status: '',
        priority: '',
        overdue: false
      }
    },

    clearError() {
      this.error = null
    }
  }
})