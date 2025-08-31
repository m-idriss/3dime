/* =========================
   UI Management
   ========================= */

import { CONFIG } from './config.js';
import { getCurrentLanguageUI } from './language.js';

export function setupBurgerMenu() {
  const burgerBtn = document.getElementById(CONFIG.SELECTORS.BURGER_BTN.slice(1));
  const dropdown = document.getElementById(CONFIG.SELECTORS.PROFILE_DROPDOWN.slice(1));
  const themeToggle = document.getElementById(CONFIG.SELECTORS.THEME_TOGGLE.slice(1));
  const fontSizeToggle = document.getElementById(CONFIG.SELECTORS.FONT_SIZE_TOGGLE.slice(1));

  if (!burgerBtn || !dropdown || !themeToggle || !fontSizeToggle) {
    console.warn(
      'setupBurgerMenu: Missing DOM elements:',
      !burgerBtn ? CONFIG.SELECTORS.BURGER_BTN : '',
      !dropdown ? CONFIG.SELECTORS.PROFILE_DROPDOWN : '',
      !themeToggle ? CONFIG.SELECTORS.THEME_TOGGLE : '',
      !fontSizeToggle ? CONFIG.SELECTORS.FONT_SIZE_TOGGLE : ''
    );
    return;
  }
  
  // Initialize theme from localStorage or default to dark
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeToggleUI(true);
  } else {
    updateThemeToggleUI(false);
  }


  // Initialize font size from localStorage or default to normal
  const savedFontSize = localStorage.getItem('fontSize') || CONFIG.DEFAULT_FONT_SIZE;
  applyFontSize(savedFontSize);
  updateFontSizeToggleUI(savedFontSize);

  // Burger button click handler
  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });
  
  // Theme toggle click handler
  themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleTheme();
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
  const burgerBtn = document.getElementById(CONFIG.SELECTORS.BURGER_BTN.slice(1));
  const dropdown = document.getElementById(CONFIG.SELECTORS.PROFILE_DROPDOWN.slice(1));
  
  const isActive = dropdown.classList.contains('active');
  
  if (isActive) {
    closeDropdown();
  } else {
    dropdown.classList.add('active');
    burgerBtn.classList.add('active');
  }
}

export function closeDropdown() {
  const burgerBtn = document.getElementById(CONFIG.SELECTORS.BURGER_BTN.slice(1));
  const dropdown = document.getElementById(CONFIG.SELECTORS.PROFILE_DROPDOWN.slice(1));

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
  const themeToggle = document.getElementById(CONFIG.SELECTORS.THEME_TOGGLE.slice(1));
  if (!themeToggle) return;
  
  const icon = themeToggle.querySelector('i');
  const text = themeToggle.querySelector('span');
  
  if (isLight) {
    icon.className = 'fas fa-sun';
    text.textContent = getCurrentLanguageUI().lightMode;
  } else {
    icon.className = 'fas fa-moon';
    text.textContent = getCurrentLanguageUI().darkMode;
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
  const fontSizeToggle = document.getElementById(CONFIG.SELECTORS.FONT_SIZE_TOGGLE.slice(1));
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