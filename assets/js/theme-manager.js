/* =========================
   Advanced Theme System
   ========================= */

import { CONFIG } from './config.js';

/**
 * Advanced theme management with multiple theme options
 */
export class ThemeManager {
  constructor() {
    this.themes = {
      dark: {
        name: 'Dark',
        icon: '🌙',
        className: 'dark-theme',
        colors: {
          '--bg-primary': 'rgba(0, 0, 0, 0.8)',
          '--bg-secondary': 'rgba(255, 255, 255, 0.1)',
          '--text-primary': '#ffffff',
          '--text-secondary': '#rgba(255, 255, 255, 0.8)',
          '--accent': '#3b82f6'
        }
      },
      light: {
        name: 'Light',
        icon: '☀️',
        className: 'light-theme', 
        colors: {
          '--bg-primary': 'rgba(255, 255, 255, 0.9)',
          '--bg-secondary': 'rgba(0, 0, 0, 0.05)',
          '--text-primary': '#1a1a1a',
          '--text-secondary': 'rgba(0, 0, 0, 0.7)',
          '--accent': '#2563eb'
        }
      },
      ocean: {
        name: 'Ocean',
        icon: '🌊',
        className: 'ocean-theme',
        colors: {
          '--bg-primary': 'rgba(15, 23, 42, 0.9)',
          '--bg-secondary': 'rgba(59, 130, 246, 0.15)',
          '--text-primary': '#f8fafc',
          '--text-secondary': 'rgba(148, 163, 184, 0.9)',
          '--accent': '#0ea5e9'
        }
      },
      sunset: {
        name: 'Sunset',
        icon: '🌅',
        className: 'sunset-theme',
        colors: {
          '--bg-primary': 'rgba(45, 12, 35, 0.9)',
          '--bg-secondary': 'rgba(251, 146, 60, 0.15)',
          '--text-primary': '#fef3f2',
          '--text-secondary': 'rgba(254, 215, 170, 0.9)',
          '--accent': '#f59e0b'
        }
      },
      forest: {
        name: 'Forest',
        icon: '🌲',
        className: 'forest-theme',
        colors: {
          '--bg-primary': 'rgba(20, 83, 45, 0.9)',
          '--bg-secondary': 'rgba(34, 197, 94, 0.15)',
          '--text-primary': '#f0fdf4',
          '--text-secondary': 'rgba(187, 247, 208, 0.9)',
          '--accent': '#10b981'
        }
      },
      neon: {
        name: 'Neon',
        icon: '⚡',
        className: 'neon-theme',
        colors: {
          '--bg-primary': 'rgba(13, 13, 13, 0.95)',
          '--bg-secondary': 'rgba(236, 72, 153, 0.2)',
          '--text-primary': '#ffffff',
          '--text-secondary': 'rgba(233, 213, 255, 0.9)',
          '--accent': '#ec4899'
        }
      }
    };
    
    this.currentTheme = this.getCurrentTheme();
    this.init();
  }

  /**
   * Initialize theme system
   */
  init() {
    this.applyTheme(this.currentTheme);
    this.createThemeStyles();
  }

  /**
   * Get current theme from localStorage or default
   */
  getCurrentTheme() {
    const saved = localStorage.getItem('theme');
    return saved && this.themes[saved] ? saved : 'dark';
  }

  /**
   * Apply theme to document
   */
  applyTheme(themeKey) {
    const theme = this.themes[themeKey];
    if (!theme) return;

    // Remove all theme classes
    Object.keys(this.themes).forEach(key => {
      document.body.classList.remove(this.themes[key].className);
    });

    // Add new theme class
    document.body.classList.add(theme.className);

    // Apply CSS custom properties
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    this.currentTheme = themeKey;
    localStorage.setItem('theme', themeKey);
    
    console.log(`Theme Manager: Applied ${theme.name} theme`);
  }

  /**
   * Create dynamic theme styles
   */
  createThemeStyles() {
    if (document.getElementById('dynamic-theme-styles')) return;

    const style = document.createElement('style');
    style.id = 'dynamic-theme-styles';
    style.textContent = `
      /* Ocean Theme */
      .ocean-theme .card {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 58, 138, 0.6));
        border: 1px solid rgba(59, 130, 246, 0.3);
      }
      
      .ocean-theme .tech-item:hover {
        background: rgba(59, 130, 246, 0.2);
        box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
      }

      /* Sunset Theme */
      .sunset-theme .card {
        background: linear-gradient(135deg, rgba(45, 12, 35, 0.8), rgba(124, 45, 18, 0.6));
        border: 1px solid rgba(251, 146, 60, 0.3);
      }
      
      .sunset-theme .tech-item:hover {
        background: rgba(251, 146, 60, 0.2);
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
      }

      /* Forest Theme */
      .forest-theme .card {
        background: linear-gradient(135deg, rgba(20, 83, 45, 0.8), rgba(21, 128, 61, 0.6));
        border: 1px solid rgba(34, 197, 94, 0.3);
      }
      
      .forest-theme .tech-item:hover {
        background: rgba(34, 197, 94, 0.2);
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
      }

      /* Neon Theme */
      .neon-theme .card {
        background: linear-gradient(135deg, rgba(13, 13, 13, 0.9), rgba(88, 28, 135, 0.6));
        border: 1px solid rgba(236, 72, 153, 0.4);
        box-shadow: 0 0 30px rgba(236, 72, 153, 0.1);
      }
      
      .neon-theme .tech-item:hover {
        background: rgba(236, 72, 153, 0.2);
        box-shadow: 0 0 20px rgba(236, 72, 153, 0.4);
      }
      
      .neon-theme h2 {
        text-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
      }

      /* Theme transition animation */
      body {
        transition: all 0.3s ease;
      }
      
      .card {
        transition: all 0.3s ease;
      }
      
      .tech-item {
        transition: all 0.2s ease;
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Get next theme in cycle
   */
  getNextTheme() {
    const themeKeys = Object.keys(this.themes);
    const currentIndex = themeKeys.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    return themeKeys[nextIndex];
  }

  /**
   * Switch to next theme
   */
  switchToNext() {
    const nextTheme = this.getNextTheme();
    this.applyTheme(nextTheme);
    return this.themes[nextTheme];
  }

  /**
   * Switch to specific theme
   */
  switchTo(themeKey) {
    if (this.themes[themeKey]) {
      this.applyTheme(themeKey);
      return this.themes[themeKey];
    }
    return null;
  }

  /**
   * Get all available themes
   */
  getAvailableThemes() {
    return Object.entries(this.themes).map(([key, theme]) => ({
      key,
      name: theme.name,
      icon: theme.icon,
      active: key === this.currentTheme
    }));
  }

  /**
   * Create theme selector UI
   */
  createThemeSelector() {
    const selector = document.createElement('div');
    selector.className = 'theme-selector';
    selector.innerHTML = `
      <div class="theme-selector-header">
        <h3>Choose Theme</h3>
      </div>
      <div class="theme-options">
        ${this.getAvailableThemes().map(theme => `
          <button class="theme-option ${theme.active ? 'active' : ''}" 
                  data-theme="${theme.key}"
                  aria-label="Switch to ${theme.name} theme">
            <span class="theme-icon">${theme.icon}</span>
            <span class="theme-name">${theme.name}</span>
          </button>
        `).join('')}
      </div>
    `;

    // Add event listeners
    selector.querySelectorAll('.theme-option').forEach(button => {
      button.addEventListener('click', () => {
        const themeKey = button.dataset.theme;
        this.switchTo(themeKey);
        this.updateThemeSelectorUI(selector);
      });
    });

    return selector;
  }

  /**
   * Update theme selector UI
   */
  updateThemeSelectorUI(selector) {
    selector.querySelectorAll('.theme-option').forEach(button => {
      const isActive = button.dataset.theme === this.currentTheme;
      button.classList.toggle('active', isActive);
    });
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.ThemeManager = ThemeManager;
}