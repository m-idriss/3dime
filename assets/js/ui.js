/* =========================
   UI Management
   ========================= */

import { CONFIG } from './config.js';

export function setupBurgerMenu() {
  const burgerBtn = document.getElementById(CONFIG.IDS.BURGER_BTN);
  const dropdown = document.getElementById(CONFIG.IDS.PROFILE_DROPDOWN);
  const themeToggle = document.getElementById(CONFIG.IDS.THEME_TOGGLE);
  const fontSizeToggle = document.getElementById(CONFIG.IDS.FONT_SIZE_TOGGLE);
  const backgroundToggle = document.getElementById(CONFIG.IDS.BACKGROUND_TOGGLE);

  if (!burgerBtn || !dropdown || !themeToggle || !fontSizeToggle || !backgroundToggle) {
    console.warn(
      'setupBurgerMenu: Missing DOM elements:',
      !burgerBtn ? CONFIG.IDS.BURGER_BTN : '',
      !dropdown ? CONFIG.IDS.PROFILE_DROPDOWN : '',
      !themeToggle ? CONFIG.IDS.THEME_TOGGLE : '',
      !fontSizeToggle ? CONFIG.IDS.FONT_SIZE_TOGGLE : '',
      !backgroundToggle ? CONFIG.IDS.BACKGROUND_TOGGLE : ''
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
  
  // Background toggle click handler
  backgroundToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBackground();
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

export function toggleBackground() {
  const currentBackground = localStorage.getItem('background') || CONFIG.DEFAULT_BACKGROUND;
  let nextBackground;

  // Cycle through background options
  const currentIndex = CONFIG.BACKGROUND_OPTIONS.indexOf(currentBackground);
  const nextIndex = (currentIndex + 1) % CONFIG.BACKGROUND_OPTIONS.length;
  nextBackground = CONFIG.BACKGROUND_OPTIONS[nextIndex];

  localStorage.setItem('background', nextBackground);
  applyBackground(nextBackground);
  updateBackgroundToggleUI(nextBackground);
}

export function applyBackground(background) {
  const bgElement = document.querySelector('.bg');
  if (!bgElement) return;

  // Remove existing background classes
  CONFIG.BACKGROUND_OPTIONS.forEach(bg => {
    bgElement.classList.remove(`bg-${bg}`);
  });

  // Add new background class
  bgElement.classList.add(`bg-${background}`);
}

export function updateBackgroundToggleUI(background) {
  const backgroundToggle = document.getElementById(CONFIG.IDS.BACKGROUND_TOGGLE);
  if (!backgroundToggle) return;
  
  const icon = backgroundToggle.querySelector('i');
  const text = backgroundToggle.querySelector('span');
  
  const backgroundNames = {
    'dark': 'Dark Theme',
    'light': 'Light Theme', 
    'blue': 'Blue Gradient',
    'green': 'Green Gradient',
    'purple': 'Purple Gradient',
    'red': 'Red Gradient'
  };
  
  const backgroundIcons = {
    'dark': 'fas fa-moon',
    'light': 'fas fa-sun',
    'blue': 'fas fa-palette',
    'green': 'fas fa-palette',
    'purple': 'fas fa-palette',
    'red': 'fas fa-palette'
  };

  if (icon) icon.className = backgroundIcons[background] || 'fas fa-palette';
  if (text) text.textContent = `Background: ${backgroundNames[background] || 'Dark Theme'}`;
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