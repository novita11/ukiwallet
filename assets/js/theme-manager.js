// ===== THEME MANAGER ===== //

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('uki-wallet-theme') || 'dark';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createThemeToggle();
    this.bindEvents();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('uki-wallet-theme', theme);
    this.currentTheme = theme;
    
    // Update theme toggle button
    this.updateThemeToggle();
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  createThemeToggle() {
    // Create theme toggle button if it doesn't exist
    if (!document.getElementById('theme-toggle')) {
      const toggleButton = document.createElement('button');
      toggleButton.id = 'theme-toggle';
      toggleButton.className = 'theme-toggle';
      toggleButton.innerHTML = this.getToggleIcon();
      toggleButton.setAttribute('aria-label', 'Toggle theme');
      
      // Add to header or create floating button
      const header = document.querySelector('header') || document.querySelector('.header');
      if (header) {
        header.appendChild(toggleButton);
      } else {
        // Create floating toggle button
        toggleButton.classList.add('theme-toggle--floating');
        document.body.appendChild(toggleButton);
      }
    }
  }

  updateThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.innerHTML = this.getToggleIcon();
      toggleButton.setAttribute('aria-label', `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} theme`);
    }
  }

  getToggleIcon() {
    return this.currentTheme === 'dark' 
      ? '<span class="theme-icon theme-icon--sun">☀️</span>' 
      : '<span class="theme-icon theme-icon--moon">🌙</span>';
  }

  bindEvents() {
    // Theme toggle button click
    document.addEventListener('click', (e) => {
      if (e.target.closest('#theme-toggle')) {
        this.toggleTheme();
      }
    });

    // Keyboard shortcut (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }
    });

    // System theme change detection
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('uki-wallet-theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Set theme programmatically
  setTheme(theme) {
    if (['dark', 'light'].includes(theme)) {
      this.applyTheme(theme);
    }
  }
}

// ===== NOTIFICATION SYSTEM ===== //

class NotificationManager {
  constructor() {
    this.notifications = [];
    this.container = null;
    this.init();
  }

  init() {
    this.createContainer();
  }

  createContainer() {
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
      this.container = container;
    }
  }

  show(message, type = 'info', duration = 4000) {
    const notification = this.createNotification(message, type, duration);
    this.container.appendChild(notification);
    this.notifications.push(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add('notification--show');
    }, 10);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }

    return notification;
  }

  createNotification(message, type, duration) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const icon = this.getIcon(type);
    const closeBtn = duration === 0 ? '<button class="notification__close">×</button>' : '';
    
    notification.innerHTML = `
      <div class="notification__content">
        <span class="notification__icon">${icon}</span>
        <span class="notification__message">${message}</span>
        ${closeBtn}
      </div>
      <div class="notification__progress"></div>
    `;

    // Close button event
    const closeButton = notification.querySelector('.notification__close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.remove(notification));
    }

    // Progress bar animation
    if (duration > 0) {
      const progressBar = notification.querySelector('.notification__progress');
      progressBar.style.animationDuration = `${duration}ms`;
    }

    return notification;
  }

  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      loading: '⏳'
    };
    return icons[type] || icons.info;
  }

  remove(notification) {
    if (notification && notification.parentNode) {
      notification.classList.add('notification--hide');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        const index = this.notifications.indexOf(notification);
        if (index > -1) {
          this.notifications.splice(index, 1);
        }
      }, 300);
    }
  }

  clear() {
    this.notifications.forEach(notification => this.remove(notification));
  }

  // Convenience methods
  success(message, duration = 4000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 6000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 5000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 4000) {
    return this.show(message, 'info', duration);
  }

  loading(message) {
    return this.show(message, 'loading', 0);
  }
}

// ===== LOADING MANAGER ===== //

class LoadingManager {
  constructor() {
    this.activeLoaders = new Set();
    this.overlay = null;
  }

  show(message = 'Loading...', type = 'spinner') {
    const loaderId = Date.now().toString();
    this.activeLoaders.add(loaderId);
    
    if (!this.overlay) {
      this.createOverlay();
    }
    
    this.updateOverlay(message, type);
    this.overlay.classList.add('loading-overlay--show');
    
    return loaderId;
  }

  hide(loaderId) {
    if (loaderId) {
      this.activeLoaders.delete(loaderId);
    }
    
    if (this.activeLoaders.size === 0 && this.overlay) {
      this.overlay.classList.remove('loading-overlay--show');
    }
  }

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-message">Loading...</div>
      </div>
    `;
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  updateOverlay(message, type) {
    if (this.overlay) {
      const messageEl = this.overlay.querySelector('.loading-message');
      const spinnerEl = this.overlay.querySelector('.loading-spinner');
      
      if (messageEl) messageEl.textContent = message;
      if (spinnerEl) spinnerEl.className = `loading-spinner loading-spinner--${type}`;
    }
  }

  // Show loading for specific element
  showElement(element, message = '') {
    if (!element) return;
    
    element.classList.add('loading');
    if (message) {
      element.setAttribute('data-loading-message', message);
    }
  }

  hideElement(element) {
    if (!element) return;
    
    element.classList.remove('loading');
    element.removeAttribute('data-loading-message');
  }
}

// ===== INITIALIZE MANAGERS ===== //

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
  window.notificationManager = new NotificationManager();
  window.loadingManager = new LoadingManager();
  
  // Global convenience functions
  window.toast = (message, type = 'info', duration = 4000) => {
    return window.notificationManager.show(message, type, duration);
  };
  
  window.showLoading = (message, type) => {
    return window.loadingManager.show(message, type);
  };
  
  window.hideLoading = (loaderId) => {
    return window.loadingManager.hide(loaderId);
  };
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeManager, NotificationManager, LoadingManager };
}