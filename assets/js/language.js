/* =========================
   Language Management
   ========================= */

import { CONFIG } from './config.js';

export function detectLanguage() {
  // Always return English - no multi-language support
  return CONFIG.DEFAULT_LANGUAGE;
}

export function setLanguage(lang) {
  // Language is always English - this function is kept for compatibility but does nothing
  document.documentElement.lang = 'en';
}

export function getCurrentLanguageUI() {
  // Always return English UI strings
  return {
    darkMode: "Dark Mode",
    lightMode: "Light Mode"
  };
}