import { defineStore } from 'pinia';
import api from '../api';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchTasks() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get('/api/tarefas');
        this.tasks = res.data;
      } catch (err) {
        console.error(err);
        this.error = 'Erro ao carregar tarefas.';
      } finally {
        this.loading = false;
      }
    },
    async createTask(payload) {
      try {
        const res = await api.post('/api/tarefas', payload);
        this.tasks.push(res.data);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    async updateTask(id, payload) {
      try {
        const res = await api.put(`/api/tarefas/${id}`, payload);
        const index = this.tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.tasks[index] = res.data;
        }
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    async deleteTask(id) {
      try {
        await api.delete(`/api/tarefas/${id}`);
        this.tasks = this.tasks.filter((t) => t.id !== id);
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  }
});
