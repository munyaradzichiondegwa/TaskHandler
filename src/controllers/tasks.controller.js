// src/controllers/tasks.controller.js
import { TasksService } from '../services/tasks.service.js';

export const TasksController = (function () {
  let currentUser = null;
  let deleteTaskId = null;

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function updateStats(tasks) {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => !t.completed).length;
  }

  function renderTasks(tasks) {
    const container = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');
    if (!container) return;

    if (!tasks || tasks.length === 0) {
      container.innerHTML = '';
      emptyState?.classList.remove('hidden');
      return;
    }
    emptyState?.classList.add('hidden');

    container.innerHTML = tasks.map((task, idx) => {
      const compClass = task.completed ? 'line-through text-gray-500' : '';
      const desc = task.description ? `<p class="text-sm text-gray-400 mb-2">${escapeHtml(task.description)}</p>` : '';
      const badgeClass = task.priority === 'high' ? 'badge-high' : task.priority === 'medium' ? 'badge-medium' : 'badge-low';

      return `
        <div class="task-card priority-${task.priority} ${task.completed ? 'completed' : ''}">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-start gap-3 flex-1">
              <input type="checkbox" class="checkbox mt-1" ${task.completed ? 'checked' : ''} data-id="${task.id}" data-action="toggle">
              <div class="flex-1">
                <h3 class="font-semibold text-lg mb-1 ${compClass}">${escapeHtml(task.title)}</h3>
                ${desc}
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <i class="far fa-calendar"></i>
                  <span>${formatDate(task.dueDate)}</span>
                </div>
              </div>
            </div>
            <span class="badge ${badgeClass}">${escapeHtml(task.priority)}</span>
          </div>
          <div class="flex gap-2 mt-4 pt-3 border-t border-gray-700">
            <button class="editBtn flex-1 text-sm py-2 px-3 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition" data-id="${task.id}"><i class="fas fa-edit mr-1"></i> Edit</button>
            <button class="delBtn flex-1 text-sm py-2 px-3 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition" data-id="${task.id}"><i class="fas fa-trash mr-1"></i> Delete</button>
          </div>
        </div>
      `;
    }).join('');

    // wire up dynamic buttons
    container.querySelectorAll('[data-action="toggle"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        TasksService.toggleComplete(id, currentUser.username);
        filterTasks();
      });
    });

    container.querySelectorAll('.editBtn').forEach(b => {
      b.addEventListener('click', (e) => {
        const id = b.getAttribute('data-id');
        openEditModal(id);
      });
    });

    container.querySelectorAll('.delBtn').forEach(b => {
      b.addEventListener('click', (e) => {
        deleteTaskId = b.getAttribute('data-id');
        document.getElementById('deleteModal')?.classList.add('active');
      });
    });

    updateStats(tasks);
  }

  function filterTasks() {
    if (!currentUser) return;
    let userTasks = TasksService.getTasksForUser(currentUser.username);

    const status = document.getElementById('filterStatus')?.value || 'all';
    if (status === 'completed') userTasks = userTasks.filter(t => t.completed);
    else if (status === 'pending') userTasks = userTasks.filter(t => !t.completed);

    const sortBy = document.getElementById('sortBy')?.value || 'date';
    userTasks.sort((a, b) => {
      if (sortBy === 'date') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        return (order[a.priority] || 3) - (order[b.priority] || 3);
      }
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    renderTasks(userTasks);
  }

  function openEditModal(id) {
    const task = TasksService.getTasksForUser(currentUser.username).find(t => t.id === id);
    if (!task) return;
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskDueDate').value = task.dueDate;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskModal')?.classList.add('active');
  }

  function openNewTaskModal() {
    document.getElementById('modalTitle').textContent = 'New Task';
    document.getElementById('taskId').value = '';
    document.getElementById('taskForm')?.reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('taskDueDate').min = today;
    document.getElementById('taskModal')?.classList.add('active');
  }

  function closeTaskModal() {
    document.getElementById('taskModal')?.classList.remove('active');
    document.getElementById('taskForm')?.reset();
  }

  function handleTaskSubmit(e) {
    e.preventDefault();
    if (!currentUser) return;
    const id = document.getElementById('taskId')?.value || '';
    const title = (document.getElementById('taskTitle') || {}).value?.trim() || '';
    const description = (document.getElementById('taskDescription') || {}).value?.trim() || '';
    const dueDate = (document.getElementById('taskDueDate') || {}).value || '';
    const priority = (document.getElementById('taskPriority') || {}).value || 'medium';

    if (!title) { alert('Title required'); return; }

    if (id) {
      TasksService.updateTask({ id, title, description, dueDate, priority });
    } else {
      const task = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        userId: currentUser.username,
        title,
        description,
        dueDate,
        priority,
        completed: false,
        createdAt: Date.now()
      };
      TasksService.createTask(task);
    }

    closeTaskModal();
    filterTasks();
  }

  function confirmDelete() {
    if (!deleteTaskId) return;
    TasksService.deleteTask(deleteTaskId, currentUser.username);
    deleteTaskId = null;
    document.getElementById('deleteModal')?.classList.remove('active');
    filterTasks();
  }

  function cancelDelete() {
    deleteTaskId = null;
    document.getElementById('deleteModal')?.classList.remove('active');
  }

  function onLogin(user) {
    currentUser = user;
    document.getElementById('userDisplay').textContent = currentUser.username;
    filterTasks();
  }

  function onLogout() {
    currentUser = null;
    document.getElementById('userDisplay').textContent = '';
    document.getElementById('tasksContainer').innerHTML = '';
    document.getElementById('totalTasks').textContent = '0';
    document.getElementById('completedTasks').textContent = '0';
    document.getElementById('pendingTasks').textContent = '0';
  }

  function exportTasks() {
    if (!currentUser) return;
    const data = TasksService.exportTasksForUser(currentUser.username);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser.username}-tasks.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importTasksFromFile(file) {
    if (!currentUser || !file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed)) throw new Error('Invalid format');
        // Basic validation: ensure tasks have id/title
        const cleaned = parsed.map(t => ({
          id: t.id || (Date.now().toString(36) + Math.random().toString(36).slice(2)),
          title: t.title || 'Untitled',
          description: t.description || '',
          dueDate: t.dueDate || '',
          priority: t.priority || 'medium',
          completed: !!t.completed,
          createdAt: t.createdAt || Date.now()
        }));
        TasksService.importTasksForUser(currentUser.username, cleaned);
        filterTasks();
        alert('Import successful');
      } catch (err) {
        alert('Failed to import: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function attachUI() {
    // open new task
    document.getElementById('newTaskBtn')?.addEventListener('click', openNewTaskModal);
    document.getElementById('createTaskBtn')?.addEventListener('click', openNewTaskModal);

    // modal buttons
    document.getElementById('taskModalClose')?.addEventListener('click', closeTaskModal);
    document.getElementById('taskCancelBtn')?.addEventListener('click', closeTaskModal);
    document.getElementById('taskForm')?.addEventListener('submit', handleTaskSubmit);

    // delete modal
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', confirmDelete);
    document.getElementById('cancelDeleteBtn')?.addEventListener('click', cancelDelete);

    // export/import
    document.getElementById('exportBtn')?.addEventListener('click', exportTasks);
    const importFile = document.getElementById('importFile');
    if (importFile) {
      importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        importTasksFromFile(file);
        // reset input so same file can be re-imported if needed
        e.target.value = '';
      });
    }

    // clicking outside modal closes
    window.addEventListener('click', (ev) => {
      const taskModal = document.getElementById('taskModal');
      const deleteModal = document.getElementById('deleteModal');
      if (ev.target === taskModal) closeTaskModal();
      if (ev.target === deleteModal) cancelDelete();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeTaskModal();
        cancelDelete();
      }
    });
  }

  return {
    init() {
      attachUI();
      // expose for quick debugging / HTML on* attributes
      window.taskController = {
        filterTasks,
        onLogin,
        onLogout
      };
    },
    filterTasks,
    onLogin,
    onLogout
  };
})();
