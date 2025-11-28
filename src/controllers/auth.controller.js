// src/controllers/auth.controller.js
import { UsersService } from '../services/users.service.js';

export const AuthController = (function () {

  // UI helpers
  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(pageId);
    if (el) el.classList.add('active');
  }

  function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 5000);
  }

  async function handleRegister(event) {
    event.preventDefault();
    const username = (document.getElementById('registerUsername') || {}).value?.trim() || '';
    const email = (document.getElementById('registerEmail') || {}).value?.trim() || '';
    const password = (document.getElementById('registerPassword') || {}).value || '';

    if (!username || username.length < 3) { showError('registerError', 'Username too short'); return; }
    if (!email) { showError('registerError', 'Email required'); return; }
    if (!password || password.length < 6) { showError('registerError', 'Password too short'); return; }

    try {
      const user = await UsersService.createUser({ username, email, password });
      // auto-login after register
      UsersService.saveSession({ username: user.username, remember: true });
      window.appState.currentUser = user;
      // initialize tasks controller after login
      window.taskController?.onLogin(user);
      showPage('dashboardPage');
    } catch (err) {
      showError('registerError', err.message || 'Unable to register');
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const username = (document.getElementById('loginUsername') || {}).value?.trim() || '';
    const password = (document.getElementById('loginPassword') || {}).value || '';
    const remember = !!document.getElementById('rememberMe')?.checked;

    if (!username || !password) { showError('loginError', 'Enter username and password'); return; }

    try {
      const user = await UsersService.authenticate({ username, password });
      if (!user) {
        showError('loginError', 'Invalid username or password');
        return;
      }
      UsersService.saveSession({ username: user.username, remember });
      window.appState.currentUser = user;
      window.taskController?.onLogin(user);
      showPage('dashboardPage');
    } catch (err) {
      showError('loginError', 'Login failed');
    }
  }

  function handleLogout() {
    UsersService.clearSession();
    window.appState.currentUser = null;
    window.taskController?.onLogout();
    showPage('landingPage');
  }

  function tryRestoreSession() {
    const ses = UsersService.loadSession();
    if (!ses || !ses.username) return null;
    const user = UsersService.getUserByUsername(ses.username);
    if (!user) {
      UsersService.clearSession();
      return null;
    }
    // if remember was true, auto-login
    if (ses.remember) {
      window.appState.currentUser = user;
      return user;
    }
    // otherwise do not auto-login
    return null;
  }

  return {
    init() {
      // wire up DOM
      const registerForm = document.getElementById('registerForm');
      if (registerForm) registerForm.addEventListener('submit', handleRegister);

      const loginForm = document.getElementById('loginForm');
      if (loginForm) loginForm.addEventListener('submit', handleLogin);

      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

      // expose helper to window for HTML onclick use
      window.showPage = showPage;

      // attempt restore
      const restoredUser = tryRestoreSession();
      return restoredUser;
    },

    logout: handleLogout
  };
})();
