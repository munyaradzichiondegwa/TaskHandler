// Main application entry point

// Controllers
import { AuthController } from './controllers/auth.controller.js';
import { TasksController } from './controllers/tasks.controller.js';

// UI modules
import { UIAnimations } from './ui/animations.js';
import { FooterUI } from './ui/footer.js';

// Simple global state
window.appState = {
  currentUser: null
};

(async function bootstrap() {
  // Initialize authentication (restores session if exists)
  const restoredUser = AuthController.init();
  TasksController.init();

  if (restoredUser) {
    window.appState.currentUser = restoredUser;
    TasksController.onLogin(restoredUser);

    // Show dashboard if session restored
    window.showPage?.('dashboardPage');
  } else {
    // Default to landing page
    window.showPage?.('landingPage');
  }
})();

// UI polishing, animations & footer injected dynamically
window.addEventListener("DOMContentLoaded", () => {
  UIAnimations.init();
  FooterUI.init();
});

