// src/services/users.service.js
import { StorageService } from './storage.service.js';

const USERS_KEY = 'taskflow_users_v1';
const SESSION_KEY = 'taskflow_session_v1';

/**
 * Hash password using SHA-256 (Web Crypto). Returns hex string.
 * Note: client-side hashing is only a small improvement — don't treat it as secure storage.
 */
async function hashPassword(password) {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  // convert to hex
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function loadUsers() {
  return StorageService.get(USERS_KEY) || [];
}
function saveUsers(users) {
  StorageService.set(USERS_KEY, users);
}

export const UsersService = {
  async createUser({ username, email, password }) {
    const users = loadUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Username already exists');
    }
    const hashed = await hashPassword(password);
    const user = { username, email, passwordHash: hashed, createdAt: Date.now() };
    users.push(user);
    saveUsers(users);
    return user;
  },

  getUserByUsername(username) {
    const users = loadUsers();
    return users.find(u => u.username === username) || null;
  },

  async authenticate({ username, password }) {
    const user = this.getUserByUsername(username);
    if (!user) return null;
    const hashed = await hashPassword(password);
    return hashed === user.passwordHash ? user : null;
  },

  list() {
    return loadUsers();
  },

  // Session management (remember me)
  saveSession({ username, remember = true }) {
    const payload = { username, remember };
    if (remember) {
      StorageService.set(SESSION_KEY, payload);
    } else {
      // store session but not persistent if remember=false
      // we still set it in localStorage as ephemeral (for demo). In real apps, use sessionStorage.
      StorageService.set(SESSION_KEY, payload);
    }
  },

  loadSession() {
    return StorageService.get(SESSION_KEY);
  },

  clearSession() {
    StorageService.remove(SESSION_KEY);
  }
};
