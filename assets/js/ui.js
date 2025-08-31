/* =========================
   UI Management
   ========================= */

import { CONFIG } from './config.js';
import { ThemeManager } from './theme-manager.js';

// Initialize theme manager
let themeManager;

export function setupBurgerMenu() {
  const burgerBtn = document.getElementById(CONFIG.IDS.BURGER_BTN);
  const dropdown = document.getElementById(CONFIG.IDS.PROFILE_DROPDOWN);
  const themeToggle = document.getElementById(CONFIG.IDS.THEME_TOGGLE);
  const fontSizeToggle = document.getElementById(CONFIG.IDS.FONT_SIZE_TOGGLE);

  if (!burgerBtn || !dropdown || !themeToggle || !fontSizeToggle) {
    console.warn(
      'setupBurgerMenu: Missing DOM elements:',
      !burgerBtn ? CONFIG.IDS.BURGER_BTN : '',
      !dropdown ? CONFIG.IDS.PROFILE_DROPDOWN : '',
      !themeToggle ? CONFIG.IDS.THEME_TOGGLE : '',
      !fontSizeToggle ? CONFIG.IDS.FONT_SIZE_TOGGLE : ''
    );
    return;
  }
  
  // Initialize advanced theme manager
  themeManager = new ThemeManager();
  
  // Update theme toggle to use advanced theme system
  updateThemeToggleUI(themeManager.currentTheme !== 'dark');

  // Initialize font size from localStorage or default to normal
  const savedFontSize = localStorage.getItem('fontSize') || CONFIG.DEFAULT_FONT_SIZE;
  applyFontSize(savedFontSize);
  updateFontSizeToggleUI(savedFontSize);

  // Burger button click handler
  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });
  
  // Enhanced theme toggle - cycles through all themes
  themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const newTheme = themeManager.switchToNext();
    updateThemeToggleUI(newTheme.name !== 'Dark');
    
    // Show theme notification
    showThemeNotification(newTheme);
  });
  
  // Notifications toggle click handler
// Font size toggle click handler
  fontSizeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFontSize();
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !burgerBtn.contains(e.target)) {
      closeDropdown();
    }
  });
  
  // Close dropdown on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  });
}

export function toggleDropdown() {
  const burgerBtn = document.getElementById(CONFIG.IDS.BURGER_BTN);
  const dropdown = document.getElementById(CONFIG.IDS.PROFILE_DROPDOWN);
  
  const isActive = dropdown.classList.contains('active');
  
  if (isActive) {
    closeDropdown();
  } else {
    dropdown.classList.add('active');
    burgerBtn.classList.add('active');
  }
}

export function closeDropdown() {
  const burgerBtn = document.getElementById(CONFIG.IDS.BURGER_BTN);
  const dropdown = document.getElementById(CONFIG.IDS.PROFILE_DROPDOWN);

  if (dropdown && burgerBtn) {
    dropdown.classList.remove('active');
    burgerBtn.classList.remove('active');
  }
}


export function toggleTheme() {
  const isLight = document.body.classList.contains('light-theme');
  
  if (isLight) {
    document.body.classList.remove('light-theme');
    localStorage.setItem('theme', CONFIG.DEFAULT_THEME);
    updateThemeToggleUI(false);
  } else {
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
    updateThemeToggleUI(true);
  }
}

export function updateThemeToggleUI(isLight) {
  const themeToggle = document.getElementById(CONFIG.IDS.THEME_TOGGLE);
  if (!themeToggle) return;
  
  const icon = themeToggle.querySelector('i');
  const text = themeToggle.querySelector('span');
  
  if (isLight) {
    icon.className = 'fas fa-sun';
    text.textContent = 'Light Mode';
  } else {
    icon.className = 'fas fa-moon';
    text.textContent = 'Dark Mode';
  }
}


export function toggleFontSize() {
  const currentSize = localStorage.getItem('fontSize') || CONFIG.DEFAULT_FONT_SIZE;
  let nextSize;

  // Cycle through: normal -> large -> small -> normal
  const currentIndex = CONFIG.FONT_SIZES.indexOf(currentSize);
  const nextIndex = (currentIndex + 1) % CONFIG.FONT_SIZES.length;
  nextSize = CONFIG.FONT_SIZES[nextIndex];

  localStorage.setItem('fontSize', nextSize);
  applyFontSize(nextSize);
  updateFontSizeToggleUI(nextSize);
}

export function applyFontSize(size) {
  // Remove existing font size classes
  document.body.classList.remove('font-small', 'font-large');

  // Apply new font size class
  if (size === 'small') {
    document.body.classList.add('font-small');
  } else if (size === 'large') {
    document.body.classList.add('font-large');
  }
  // Normal size doesn't need a class (uses default CSS variables)
}

export function updateFontSizeToggleUI(size) {
  const fontSizeToggle = document.getElementById(CONFIG.IDS.FONT_SIZE_TOGGLE);
  if (!fontSizeToggle) return;

  const text = fontSizeToggle.querySelector('span');
  const sizeNames = {
    'small': 'Small',
    'normal': 'Normal',
    'large': 'Large'
  };

  text.textContent = `Font Size: ${sizeNames[size] || 'Normal'}`;
}

export function setupLogoReload() {
  const logos = document.querySelectorAll('.logo');
  logos.forEach(logo => {
    logo.addEventListener('click', () => {
      document.body.classList.add('fade-out');
      setTimeout(() => location.reload(), CONFIG.FADE_TIMEOUT);
    });
  });
}

/**
 * Show theme change notification
 */
function showThemeNotification(theme) {
  // Remove existing notifications
  const existing = document.querySelector('.theme-notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = 'theme-notification';
  notification.innerHTML = `
    <span class="theme-icon">${theme.icon}</span>
    <span class="theme-text">${theme.name} theme</span>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Remove after 2 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

/**
 * Get theme manager instance
 */
export function getThemeManager() {
  return themeManager;
}

// Make getThemeManager globally available for mobile UX
if (typeof window !== 'undefined') {
  window.getThemeManager = getThemeManager;
}