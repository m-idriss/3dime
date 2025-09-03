/* =========================
   UI Management
   ========================= */

import { CONFIG } from './config.js';
import { updateHeatmapTheme } from './heatmap.js';

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
  
  // Initialize theme from localStorage or default
  const savedTheme = localStorage.getItem('theme') || CONFIG.DEFAULT_THEME;
  applyTheme(savedTheme);
  updateThemeToggleUI(savedTheme);

  // Initialize font size from localStorage or default to normal
  const savedFontSize = localStorage.getItem('fontSize') || CONFIG.DEFAULT_FONT_SIZE;
  applyFontSize(savedFontSize);
  updateFontSizeToggleUI(savedFontSize);

  // Initialize background from localStorage or default 
  const savedBackground = localStorage.getItem('background') || CONFIG.DEFAULT_BACKGROUND;
  applyBackground(savedBackground);
  updateVideoBgToggleUI(savedBackground);

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
  const currentTheme = getCurrentTheme();
  
  // Cycle through: dark -> white -> glass -> dark
  const currentIndex = CONFIG.THEME_MODES.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % CONFIG.THEME_MODES.length;
  const nextTheme = CONFIG.THEME_MODES[nextIndex];
  
  // Remove all theme classes
  document.body.classList.remove('dark-theme', 'white-theme', 'glass-theme');
  
  // Add the new theme class (consistent with applyTheme function)
  document.body.classList.add(`${nextTheme}-theme`);
  
  localStorage.setItem('theme', nextTheme);
  updateThemeToggleUI(nextTheme);
  updateThemeColor(nextTheme);
  
  // Update heatmap theme to match the new website theme
  updateHeatmapTheme();
}

function getCurrentTheme() {
  if (document.body.classList.contains('white-theme')) return 'white';
  if (document.body.classList.contains('glass-theme')) return 'glass';
  return 'dark'; // default or dark-theme class
}

export function applyTheme(theme) {
  // Remove all theme classes
  document.body.classList.remove('dark-theme', 'white-theme', 'glass-theme');
  
  // Add the appropriate theme class
  if (theme === 'white') {
    document.body.classList.add('white-theme');
  } else if (theme === 'glass') {
    document.body.classList.add('glass-theme');
  } else {
    // dark theme or default
    document.body.classList.add('dark-theme');
  }
  
  // Update theme color for mobile browser status bar
  updateThemeColor(theme);
}

export function updateThemeToggleUI(theme) {
  const themeToggle = document.getElementById(CONFIG.IDS.THEME_TOGGLE);
  if (!themeToggle) return;
  
  const icon = themeToggle.querySelector('i');
  const text = themeToggle.querySelector('span');
  
  switch(theme) {
    case 'dark':
      icon.className = 'fas fa-moon';
      text.textContent = 'Dark Theme';
      break;
    case 'white':
      icon.className = 'fas fa-sun';
      text.textContent = 'Light Theme';
      break;
    case 'glass':
      icon.className = 'fas fa-gem';
      text.textContent = 'Glass Theme';
      break;
    default:
      icon.className = 'fas fa-moon';
      text.textContent = 'Dark Theme';
  }
}

export function updateThemeColor(theme) {
  const themeColorMeta = document.getElementById('theme-color-meta');
  if (!themeColorMeta) return;
  
  switch(theme) {
    case 'dark':
      themeColorMeta.setAttribute('content', '#000000');
      break;
    case 'white':
      themeColorMeta.setAttribute('content', '#ffffff');
      break;
    case 'glass':
      // Glass theme uses dark theme browser color as specified in issue
      themeColorMeta.setAttribute('content', '#000000');
      break;
    default:
      themeColorMeta.setAttribute('content', '#000000');
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
  const currentBg = getCurrentBackground();
  
  // Cycle through: black -> white -> video -> black
  const currentIndex = CONFIG.BACKGROUND_MODES.indexOf(currentBg);
  const nextIndex = (currentIndex + 1) % CONFIG.BACKGROUND_MODES.length;
  const nextBackground = CONFIG.BACKGROUND_MODES[nextIndex];
  
  localStorage.setItem('background', nextBackground);
  applyBackground(nextBackground);
  updateVideoBgToggleUI(nextBackground);
}

function getCurrentBackground() {
  const savedBackground = localStorage.getItem('background');
  if (savedBackground && CONFIG.BACKGROUND_MODES.includes(savedBackground)) {
    return savedBackground;
  }
  return CONFIG.DEFAULT_BACKGROUND;
}

export function applyBackground(mode) {
  const bgElement = document.querySelector('.bg');
  if (!bgElement) return;

  // Remove all background classes
  document.body.classList.remove('bg-black', 'bg-white', 'bg-video');
  
  switch(mode) {
    case 'black':
      bgElement.innerHTML = '';
      bgElement.style.background = '#000000';
      document.body.classList.add('bg-black');
      break;
      
    case 'white':
      bgElement.innerHTML = '';
      bgElement.style.background = '#ffffff';
      document.body.classList.add('bg-white');
      break;
      
    case 'video':
      bgElement.innerHTML = `
        <video autoplay muted loop playsinline 
               style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;"
               aria-hidden="true">
          <source src="assets/background.mp4" type="video/mp4">
        </video>
      `;
      bgElement.style.background = 'transparent';
      document.body.classList.add('bg-video');
      break;
      
    default:
      bgElement.innerHTML = '';
      bgElement.style.background = '#000000';
      document.body.classList.add('bg-black');
  }
}

export function updateVideoBgToggleUI(mode) {
  const videoBgToggle = document.getElementById(CONFIG.IDS.VIDEO_BG_TOGGLE);
  if (!videoBgToggle) return;
  
  const icon = videoBgToggle.querySelector('i');
  const text = videoBgToggle.querySelector('span');
  
  switch(mode) {
    case 'black':
      icon.className = 'fas fa-circle';
      text.textContent = 'Dark Background';
      break;
    case 'white':
      icon.className = 'far fa-circle';
      text.textContent = 'Light Background';
      break;
    case 'video':
      icon.className = 'fas fa-play';
      text.textContent = 'Video Background';
      break;
    default:
      icon.className = 'fas fa-circle';
      text.textContent = 'Dark Background';
  }
}

// Legacy function for backward compatibility
export function applyVideoBackground(enabled) {
  applyBackground(enabled ? 'video' : 'black');
}