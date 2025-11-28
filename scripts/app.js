// app.js

/**
 * TaskFlow — now with full persistent storage
 * Users, tasks, and current session are stored in localStorage
 */

/* State */
let currentUser = null;
let tasks = [];
let editingTaskId = null;
let deleteTaskId = null;
let users = [];

/* Storage Functions */
function saveToStorage() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

function loadFromStorage() {
  users = JSON.parse(localStorage.getItem("users")) || [];
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
}

function logoutCleanup() {
  localStorage.removeItem("currentUser");
}

/* Init */
document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
  checkAuth();
  setupDarkMode();
  setMinDate();
});

/* Dark mode */
function setupDarkMode() {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  }
  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      if (event.matches) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    });
  } catch (e) {}
}

/* Date input */
function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("taskDueDate");
  if (dateInput) dateInput.min = today;
}

/* Navigation */
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  const el = document.getElementById(pageId);
  if (el) el.classList.add("active");
}

/* Auth */
function checkAuth() {
  if (currentUser) {
    showPage("dashboardPage");
    const userDisplay = document.getElementById("userDisplay");
    if (userDisplay) userDisplay.textContent = currentUser.username;
    loadTasks();
  } else {
    showPage("landingPage");
  }
}

function handleRegister(event) {
  event.preventDefault();
  const username = (document.getElementById("registerUsername") || {}).value?.trim() || "";
  const email = (document.getElementById("registerEmail") || {}).value?.trim() || "";
  const password = (document.getElementById("registerPassword") || {}).value || "";

  if (users.some((u) => u.username === username)) {
    showError("registerError", "Username already exists");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError("registerError", "Invalid email format");
    return;
  }

  const newUser = { username, email, password };
  users.push(newUser);
  currentUser = newUser;

  saveToStorage();

  (document.getElementById("registerForm") || {}).reset();
  checkAuth();
}

function handleLogin(event) {
  event.preventDefault();
  const username = (document.getElementById("loginUsername") || {}).value?.trim() || "";
  const password = (document.getElementById("loginPassword") || {}).value || "";

  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    currentUser = user;
    saveToStorage();
    (document.getElementById("loginForm") || {}).reset();
    checkAuth();
  } else {
    showError("loginError", "Invalid username or password");
  }
}

function handleLogout() {
  currentUser = null;
  logoutCleanup();
  checkAuth();
}

/* Errors */
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (!errorElement) return;
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
  setTimeout(() => errorElement.classList.add("hidden"), 5000);
}

/* Tasks */
function saveTasks() {
  saveToStorage();
}

function loadTasks() {
  if (!currentUser) return;
  const userTasks = tasks.filter((t) => t.userId === currentUser.username);
  renderTasks(userTasks);
  updateStats(userTasks);
}

function updateStats(userTasks) {
  const total = userTasks.length;
  const completed = userTasks.filter((t) => t.completed).length;
  const pending = total - completed;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("pendingTasks").textContent = pending;
}

function renderTasks(tasksToRender) {
  const container = document.getElementById("tasksContainer");
  const emptyState = document.getElementById("emptyState");
  if (!container) return;

  if (!tasksToRender || tasksToRender.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  container.innerHTML = tasksToRender
    .map(
      (task, index) => `
    <div class="task-card priority-${task.priority} ${task.completed ? "completed" : ""}" style="animation-delay: ${index * 0.05}s">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-start gap-3 flex-1">
          <input type="checkbox"
                 class="checkbox mt-1"
                 ${task.completed ? "checked" : ""}
                 onchange="toggleTaskComplete('${task.id}')"
                 aria-label="Mark task as ${task.completed ? "incomplete" : "complete"}">
          <div class="flex-1">
            <h3 class="font-semibold text-lg mb-1 ${task.completed ? "line-through text-gray-500" : ""}">${escapeHtml(
              task.title
            )}</h3>
            ${
              task.description
                ? `<p class="text-sm text-gray-400 mb-2">${escapeHtml(task.description)}</p>`
                : ""
            }
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <i class="far fa-calendar"></i>
              <span>${formatDate(task.dueDate)}</span>
            </div>
          </div>
        </div>
        <span class="badge badge-${task.priority}">${task.priority}</span>
      </div>
      <div class="flex gap-2 mt-4 pt-3 border-t border-gray-700">
        <button onclick="editTask('${task.id}')" class="flex-1 text-sm py-2 px-3 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition">
          <i class="fas fa-edit mr-1"></i> Edit
        </button>
        <button onclick="openDeleteModal('${task.id}')" class="flex-1 text-sm py-2 px-3 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
          <i class="fas fa-trash mr-1"></i> Delete
        </button>
      </div>
    </div>
  `
    )
    .join("");
}

/* Filter & sort */
function filterTasks() {
  if (!currentUser) return;

  let userTasks = tasks.filter((task) => task.userId === currentUser.username);

  const statusFilter = document.getElementById("filterStatus")?.value || "all";
  if (statusFilter === "completed") userTasks = userTasks.filter((t) => t.completed);
  else if (statusFilter === "pending") userTasks = userTasks.filter((t) => !t.completed);

  const sortBy = document.getElementById("sortBy")?.value || "date";
  userTasks.sort((a, b) => {
    if (sortBy === "date") return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  renderTasks(userTasks);
  updateStats(tasks.filter((task) => task.userId === currentUser.username));
}

/* Modal Handling */
function openTaskModal() {
  editingTaskId = null;
  document.getElementById("modalTitle").textContent = "New Task";
  document.getElementById("taskForm").reset();
  document.getElementById("taskId").value = "";
  setMinDate();
  document.getElementById("taskModal").classList.add("active");
}

function closeTaskModal() {
  document.getElementById("taskModal").classList.remove("active");
  editingTaskId = null;
}

function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  editingTaskId = taskId;
  document.getElementById("modalTitle").textContent = "Edit Task";
  document.getElementById("taskId").value = task.id;
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDescription").value = task.description;
  document.getElementById("taskDueDate").value = task.dueDate;
  document.getElementById("taskPriority").value = task.priority;

  document.getElementById("taskModal").classList.add("active");
}

/* Submit */
function handleTaskSubmit(event) {
  event.preventDefault();

  const title = (document.getElementById("taskTitle") || {}).value?.trim() || "";
  const description = (document.getElementById("taskDescription") || {}).value?.trim() || "";
  const dueDate = (document.getElementById("taskDueDate") || {}).value || "";
  const priority = (document.getElementById("taskPriority") || {}).value || "medium";

  if (editingTaskId) {
    const idx = tasks.findIndex((t) => t.id === editingTaskId);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], title, description, dueDate, priority };
    }
  } else {
    const newTask = {
      id: generateId(),
      title,
      description,
      dueDate,
      priority,
      completed: false,
      userId: currentUser.username,
      createdAt: Date.now(),
    };
    tasks.push(newTask);
  }

  saveTasks();
  closeTaskModal();
  filterTasks();
}

/* Complete Toggle */
function toggleTaskComplete(taskId) {
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx !== -1) {
    tasks[idx].completed = !tasks[idx].completed;
    saveTasks();
    filterTasks();
  }
}

/* Delete */
function openDeleteModal(taskId) {
  deleteTaskId = taskId;
  document.getElementById("deleteModal").classList.add("active");
}

function closeDeleteModal() {
  deleteTaskId = null;
  document.getElementById("deleteModal").classList.remove("active");
}

function confirmDelete() {
  if (!deleteTaskId) return;

  tasks = tasks.filter((t) => t.id !== deleteTaskId);
  saveTasks();

  closeDeleteModal();
  filterTasks();
}

/* Utils */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* Close modals clicking outside / Escape key */
window.onclick = function (event) {
  if (event.target === document.getElementById("taskModal")) closeTaskModal();
  if (event.target === document.getElementById("deleteModal")) closeDeleteModal();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeTaskModal();
    closeDeleteModal();
  }
});
