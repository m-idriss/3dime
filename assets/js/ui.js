/* =========================
   UI Management
   ========================= */

import { CONFIG } from './config.js';

export function setupBurgerMenu() {
  const burgerBtn = document.getElementById(CONFIG.IDS.BURGER_BTN);
  const dropdown = document.getElementById(CONFIG.IDS.PROFILE_DROPDOWN);
  const themeToggle = document.getElementById(CONFIG.IDS.THEME_TOGGLE);
  const fontSizeToggle = document.getElementById(CONFIG.IDS.FONT_SIZE_TOGGLE);
  const videoBgToggle = document.getElementById(CONFIG.IDS.VIDEO_BG_TOGGLE);

  if (!burgerBtn || !dropdown || !themeToggle || !fontSizeToggle || !videoBgToggle) {
    console.warn(
      'setupBurgerMenu: Missing DOM elements:',
      !burgerBtn ? CONFIG.IDS.BURGER_BTN : '',
      !dropdown ? CONFIG.IDS.PROFILE_DROPDOWN : '',
      !themeToggle ? CONFIG.IDS.THEME_TOGGLE : '',
      !fontSizeToggle ? CONFIG.IDS.FONT_SIZE_TOGGLE : '',
      !videoBgToggle ? CONFIG.IDS.VIDEO_BG_TOGGLE : ''
    );
    return;
  }
  
  // Initialize theme from localStorage or default to light
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    updateThemeToggleUI(false);
  } else {
    updateThemeToggleUI(true);
  }


  // Initialize font size from localStorage or default to normal
  const savedFontSize = localStorage.getItem('fontSize') || CONFIG.DEFAULT_FONT_SIZE;
  applyFontSize(savedFontSize);
  updateFontSizeToggleUI(savedFontSize);

  // Initialize video background from localStorage or default to false
  const savedVideoBg = localStorage.getItem('videoBg') === 'true' || CONFIG.DEFAULT_VIDEO_BACKGROUND;
  applyVideoBackground(savedVideoBg);
  updateVideoBgToggleUI(savedVideoBg);

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

  // Video background toggle click handler
  videoBgToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleVideoBackground();
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
  const isDark = document.body.classList.contains('dark-theme');
  
  if (isDark) {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', CONFIG.DEFAULT_THEME);
    updateThemeToggleUI(true);
  } else {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
    updateThemeToggleUI(false);
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

export function toggleVideoBackground() {
  const isVideoEnabled = localStorage.getItem('videoBg') === 'true';
  const newValue = !isVideoEnabled;
  
  localStorage.setItem('videoBg', newValue.toString());
  applyVideoBackground(newValue);
  updateVideoBgToggleUI(newValue);
}

export function applyVideoBackground(enabled) {
  const bgElement = document.querySelector('.bg');
  if (!bgElement) return;

  if (enabled) {
    // Add video background
    bgElement.innerHTML = `
      <video autoplay muted loop playsinline 
             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;"
             aria-hidden="true">
        <source src="assets/background.mp4" type="video/mp4">
      </video>
    `;
    bgElement.style.background = 'transparent';
    document.body.classList.add('video-bg-enabled');
  } else {
    // Remove video and use solid background
    bgElement.innerHTML = '';
    bgElement.style.background = 'var(--body-bg)';
    document.body.classList.remove('video-bg-enabled');
  }
}

export function updateVideoBgToggleUI(enabled) {
  // The CSS automatically handles the toggle appearance based on body.video-bg-enabled class
  // No additional UI updates needed since we use CSS-only toggle state
}