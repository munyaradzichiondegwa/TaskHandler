// src/services/tasks.service.js
import { StorageService } from './storage.service.js';

const TASKS_KEY = 'taskflow_tasks_v1';

function loadAll() {
  return StorageService.get(TASKS_KEY) || [];
}
function saveAll(tasks) {
  StorageService.set(TASKS_KEY, tasks);
}

export const TasksService = {
  createTask(task) {
    const tasks = loadAll();
    tasks.push(task);
    saveAll(tasks);
    return task;
  },

  updateTask(updated) {
    let tasks = loadAll();
    tasks = tasks.map(t => t.id === updated.id ? { ...t, ...updated } : t);
    saveAll(tasks);
    return updated;
  },

  deleteTask(id, userId) {
    let tasks = loadAll();
    const before = tasks.length;
    tasks = tasks.filter(t => !(t.id === id && t.userId === userId));
    saveAll(tasks);
    return tasks.length !== before;
  },

  toggleComplete(id, userId) {
    const tasks = loadAll();
    const idx = tasks.findIndex(t => t.id === id && t.userId === userId);
    if (idx === -1) return null;
    tasks[idx].completed = !tasks[idx].completed;
    saveAll(tasks);
    return tasks[idx];
  },

  getTasksForUser(userId) {
    const tasks = loadAll();
    return tasks.filter(t => t.userId === userId).sort((a, b) => a.createdAt - b.createdAt);
  },

  importTasksForUser(userId, importedTasks = []) {
    const tasks = loadAll().filter(t => t.userId !== userId).concat(importedTasks.map(t => ({ ...t, userId })));
    saveAll(tasks);
  },

  exportTasksForUser(userId) {
    return this.getTasksForUser(userId);
  }
};
