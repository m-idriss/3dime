/* =========================
   3DIME - PWA Enhancement Module
   
   Handles Progressive Web App features including:
   - Install prompts and user engagement
   - Offline status detection and messaging
   - Enhanced service worker communication
   - PWA-specific UI improvements
   
   @module pwa
   @version 2.0
   @author Idriss Mohamady
   @since 2024
   ========================= */

/* =========================
   PWA Install Prompt Management
   ========================= */

class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.isInstallable = false;
    this.isInstalled = false;
    this.installButton = null;
    
    this.init();
  }

  /**
   * Initialize PWA install functionality
   * @returns {void}
   */
  init() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: Install prompt available');
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstallable = true;
      this.showInstallPrompt();
    });

    // Listen for successful app installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA: App was installed');
      this.isInstalled = true;
      this.hideInstallPrompt();
      this.showInstallSuccessMessage();
    });

    // Check if app is already running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      console.log('PWA: Running in standalone mode');
      this.isInstalled = true;
    }
  }

  /**
   * Show install prompt UI
   * @returns {void}
   */
  showInstallPrompt() {
    if (this.isInstalled || !this.isInstallable) return;

    // Create install prompt UI
    this.createInstallButton();
    
    // Show install banner after a delay (non-intrusive)
    setTimeout(() => {
      this.showInstallBanner();
    }, 10000); // Show after 10 seconds
  }

  /**
   * Create install button in the UI
   * @returns {void}
   */
  createInstallButton() {
    const profileDropdown = document.getElementById('profile-dropdown');
    if (!profileDropdown || this.installButton) return;

    this.installButton = document.createElement('button');
    this.installButton.className = 'dropdown-item install-app-btn';
    this.installButton.innerHTML = '<i class="fa fa-download" aria-hidden="true"></i> Install App';
    this.installButton.setAttribute('aria-label', 'Install 3dime as an app');
    
    this.installButton.addEventListener('click', () => {
      this.triggerInstall();
    });

    // Add to dropdown menu only once
    const existingInstall = profileDropdown.querySelector('.install-app-btn');
    if (!existingInstall) {
      const separator = document.createElement('div');
      separator.className = 'dropdown-separator';
      profileDropdown.appendChild(separator);
      profileDropdown.appendChild(this.installButton);
    }
  }

  /**
   * Show non-intrusive install banner
   * @returns {void}
   */
  showInstallBanner() {
    if (this.isInstalled || !this.isInstallable) return;

    const banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.innerHTML = `
      <div class="install-banner-content">
        <div class="install-banner-text">
          <strong>Install 3dime</strong>
          <p>Get quick access from your home screen</p>
        </div>
        <div class="install-banner-actions">
          <button class="install-banner-btn install-btn">Install</button>
          <button class="install-banner-btn dismiss-btn">Dismiss</button>
        </div>
      </div>
    `;

    // Add banner styles
    const style = document.createElement('style');
    style.textContent = `
      .install-banner {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: var(--space-lg);
        box-shadow: var(--shadow-card-hover);
        z-index: 1000;
        max-width: 400px;
        width: calc(100% - 40px);
        animation: slideUp 0.3s ease-out;
      }
      
      .install-banner-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-lg);
      }
      
      .install-banner-text strong {
        color: var(--text-primary);
        font-size: var(--font-size-lg);
        display: block;
        margin-bottom: 4px;
      }
      
      .install-banner-text p {
        color: var(--text-secondary);
        font-size: var(--font-size-base);
        margin: 0;
      }
      
      .install-banner-actions {
        display: flex;
        gap: var(--space-sm);
        flex-shrink: 0;
      }
      
      .install-banner-btn {
        padding: 8px 16px;
        border-radius: var(--radius-md);
        border: 1px solid var(--glass-border);
        background: var(--glass-bg);
        color: var(--text-primary);
        font-size: 14px;
        cursor: pointer;
        transition: all var(--t-fast);
      }
      
      .install-banner-btn:hover {
        background: var(--glass-bg-hover);
        transform: translateY(-1px);
      }
      
      .install-btn {
        background: var(--accent-color);
        border-color: var(--accent-color);
        color: white;
      }
      
      @keyframes slideUp {
        from {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 480px) {
        .install-banner-content {
          flex-direction: column;
          text-align: center;
          gap: var(--space-md);
        }
        
        .install-banner-actions {
          justify-content: center;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Add event listeners
    banner.querySelector('.install-btn').addEventListener('click', () => {
      this.triggerInstall();
      banner.remove();
    });

    banner.querySelector('.dismiss-btn').addEventListener('click', () => {
      banner.remove();
      // Don't show again for this session
      sessionStorage.setItem('installBannerDismissed', 'true');
    });

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (banner.parentNode) {
        banner.remove();
      }
    }, 30000);
  }

  /**
   * Trigger the native install prompt
   * @returns {Promise<void>}
   */
  async triggerInstall() {
    if (!this.deferredPrompt) {
      console.log('PWA: No install prompt available');
      return;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for user response
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`PWA: User ${outcome} the install prompt`);
      
      // Reset the deferred prompt
      this.deferredPrompt = null;
      this.isInstallable = false;
      
      if (outcome === 'accepted') {
        this.hideInstallPrompt();
      }
    } catch (error) {
      console.error('PWA: Install prompt failed:', error);
    }
  }

  /**
   * Hide install prompt UI
   * @returns {void}
   */
  hideInstallPrompt() {
    if (this.installButton) {
      this.installButton.remove();
      this.installButton = null;
    }
    
    // Remove any existing banners
    const banners = document.querySelectorAll('.install-banner');
    banners.forEach(banner => banner.remove());
  }

  /**
   * Show success message after installation
   * @returns {void}
   */
  showInstallSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'install-success-toast';
    message.innerHTML = `
      <div class="toast-content">
        <i class="fa fa-check-circle" aria-hidden="true"></i>
        <span>App installed successfully!</span>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .install-success-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(34, 197, 94, 0.9);
        backdrop-filter: blur(12px);
        border-radius: var(--radius-md);
        padding: var(--space-md);
        color: white;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-in 2.7s;
        animation-fill-mode: forwards;
      }
      
      .toast-content {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeOut {
        to {
          opacity: 0;
          transform: translateX(100%);
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(message);

    // Remove after animation
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 3000);
  }
}

/* =========================
   Offline Status Management
   ========================= */

class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.offlineToast = null;
    
    this.init();
  }

  /**
   * Initialize offline status monitoring
   * @returns {void}
   */
  init() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('PWA: Back online');
      this.isOnline = true;
      this.hideOfflineMessage();
      this.showOnlineMessage();
    });

    window.addEventListener('offline', () => {
      console.log('PWA: Gone offline');
      this.isOnline = false;
      this.showOfflineMessage();
    });

    // Check initial status
    if (!this.isOnline) {
      setTimeout(() => {
        this.showOfflineMessage();
      }, 1000);
    }
  }

  /**
   * Show offline status message
   * @returns {void}
   */
  showOfflineMessage() {
    if (this.offlineToast) return;

    this.offlineToast = document.createElement('div');
    this.offlineToast.className = 'offline-toast';
    this.offlineToast.innerHTML = `
      <div class="toast-content">
        <i class="fa fa-wifi" aria-hidden="true" style="opacity: 0.5;"></i>
        <div class="toast-text">
          <strong>You're offline</strong>
          <p>Some features may be limited</p>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .offline-toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(239, 68, 68, 0.9);
        backdrop-filter: blur(12px);
        border-radius: var(--radius-md);
        padding: var(--space-md);
        color: white;
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
        max-width: 300px;
      }
      
      .offline-toast .toast-content {
        display: flex;
        align-items: center;
        gap: var(--space-md);
      }
      
      .offline-toast .toast-text strong {
        display: block;
        margin-bottom: 2px;
      }
      
      .offline-toast .toast-text p {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }
      
      @keyframes slideDown {
        from {
          transform: translateX(-50%) translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.offlineToast);
  }

  /**
   * Hide offline status message
   * @returns {void}
   */
  hideOfflineMessage() {
    if (this.offlineToast) {
      this.offlineToast.style.animation = 'slideDown 0.3s ease-out reverse';
      setTimeout(() => {
        if (this.offlineToast && this.offlineToast.parentNode) {
          this.offlineToast.remove();
          this.offlineToast = null;
        }
      }, 300);
    }
  }

  /**
   * Show back online message
   * @returns {void}
   */
  showOnlineMessage() {
    const message = document.createElement('div');
    message.className = 'online-toast';
    message.innerHTML = `
      <div class="toast-content">
        <i class="fa fa-wifi" aria-hidden="true"></i>
        <span>Back online!</span>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .online-toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(34, 197, 94, 0.9);
        backdrop-filter: blur(12px);
        border-radius: var(--radius-md);
        padding: var(--space-md);
        color: white;
        z-index: 1000;
        animation: slideDown 0.3s ease-out, fadeOut 0.3s ease-in 1.7s;
        animation-fill-mode: forwards;
      }
      
      .online-toast .toast-content {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(message);

    // Remove after animation
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 2000);
  }
}

/* =========================
   PWA Module Initialization
   ========================= */

let pwaInstaller;
let offlineManager;

/**
 * Initialize PWA enhancements
 * @returns {void}
 */
export function initPWAEnhancements() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      startPWAFeatures();
    });
  } else {
    startPWAFeatures();
  }
}

/**
 * Start PWA features
 * @returns {void}
 */
function startPWAFeatures() {
  console.log('PWA: Initializing enhanced features');
  
  // Initialize install management
  pwaInstaller = new PWAInstaller();
  
  // Initialize offline management
  offlineManager = new OfflineManager();
  
  // Enhanced service worker communication
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('PWA: Service worker message:', event.data);
      
      if (event.data.type === 'CACHE_UPDATED') {
        showUpdateAvailableMessage();
      }
    });
  }
}

/**
 * Show update available message
 * @returns {void}
 */
function showUpdateAvailableMessage() {
  const message = document.createElement('div');
  message.className = 'update-toast';
  message.innerHTML = `
    <div class="toast-content">
      <div class="toast-text">
        <strong>Update available</strong>
        <p>Refresh to get the latest version</p>
      </div>
      <button class="refresh-btn">Refresh</button>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .update-toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--primary-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: var(--space-md);
      color: var(--text-primary);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      max-width: 300px;
    }
    
    .update-toast .toast-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-md);
    }
    
    .update-toast .toast-text strong {
      display: block;
      margin-bottom: 2px;
    }
    
    .update-toast .toast-text p {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .update-toast .refresh-btn {
      background: var(--accent-color);
      border: none;
      border-radius: var(--radius-md);
      color: white;
      padding: 6px 12px;
      font-size: 14px;
      cursor: pointer;
      transition: background var(--t-fast);
    }
    
    .update-toast .refresh-btn:hover {
      background: rgba(59, 130, 246, 0.8);
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(message);

  // Add refresh functionality
  message.querySelector('.refresh-btn').addEventListener('click', () => {
    window.location.reload();
  });

  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 10000);
}

// Auto-initialize when module is imported
initPWAEnhancements();