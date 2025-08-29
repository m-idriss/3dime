/* =========================
   Language Management
   ========================= */

import { CONFIG } from './config.js';

export function detectLanguage() {
  // Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && CONFIG.SUPPORTED_LANGUAGES.includes(urlLang)) {
    return urlLang;
  }

  // Check localStorage
  const savedLang = localStorage.getItem('language');
  if (savedLang && CONFIG.SUPPORTED_LANGUAGES.includes(savedLang)) {
    return savedLang;
  }

  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'fr') {
    return 'fr';
  }

  // Default to English
  return CONFIG.DEFAULT_LANGUAGE;
}

export function setLanguage(lang) {
  if (!CONFIG.SUPPORTED_LANGUAGES.includes(lang)) return;

  localStorage.setItem('language', lang);

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Update URL without reload
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url);

  // Import and call loadContent - this creates a circular dependency we'll need to handle
  import('./content.js').then(({ loadContent }) => {
    loadContent();
  });
}

export function getCurrentLanguageUI() {
  // Return UI strings for current language (fallback to English)
  const currentLang = detectLanguage();
  if (currentLang === 'fr') {
    return {
      darkMode: "Mode Sombre",
      lightMode: "Mode Clair"
    };
  }
  return {
    darkMode: "Dark Mode",
    lightMode: "Light Mode"
  };
}