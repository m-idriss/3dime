/* =========================
   Main Application
   ========================= */

import { detectLanguage } from './language.js';
import { loadContent } from './content.js';

/* =========================
   Service Worker Registration
   ========================= */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('assets/sw.js')
      .then(() => console.log('SW registered'))
      .catch(err => console.log('SW failed', err));
  }
}

/* =========================
   Application Initialization
   ========================= */
function initializeApp() {
  // Set initial language on HTML element
  const currentLang = detectLanguage();
  document.documentElement.lang = currentLang;

  document.body.classList.add('loaded'); // fade-in
  loadContent(); // load content & trigger animations after DOM insertion
}

/* =========================
   Page Fade-In and Bootstrap
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  initializeApp();
});