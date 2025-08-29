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
async function initializeApp() {
  try {
    // Set initial language on HTML element
    const currentLang = detectLanguage();
    document.documentElement.lang = currentLang;

    document.body.classList.add('loaded'); // fade-in
    await loadContent(); // load content & trigger animations after DOM insertion
  } catch (error) {
    console.error('Application initialization failed:', error);
    // Show user-friendly error message
    const main = document.querySelector('.cards-container');
    if (main) {
      main.innerHTML = '<div class="error-message" role="alert">Unable to load the application. Please refresh the page or try again later.</div>';
    }
  }
}

/* =========================
   Page Fade-In and Bootstrap
   ========================= */
document.addEventListener('DOMContentLoaded', async () => {
  registerServiceWorker();
  await initializeApp();
});