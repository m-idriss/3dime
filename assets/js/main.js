/* =========================
   Main Application
   ========================= */

import { loadContent } from './content.js';
import { FallbackManager } from './fallbacks.js';
import { SitemapGenerator } from './sitemap-generator.js';
import { MobileUXManager } from './mobile-ux.js';

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
    // Initialize CDN fallback manager
    const fallbackManager = new FallbackManager();
    fallbackManager.init();
    
    // Set English as the default language
    document.documentElement.lang = 'en';

    document.body.classList.add('loaded'); // fade-in
    await loadContent(); // load content & trigger animations after DOM insertion
    
    // Check fallbacks after content is loaded
    setTimeout(() => {
      fallbackManager.checkAllFallbacks();
    }, 2000);
    
    // Initialize sitemap generator for development/SEO purposes
    const sitemapGenerator = new SitemapGenerator();
    setTimeout(() => {
      sitemapGenerator.logSitemapInfo();
    }, 3000);
    
    // Initialize mobile UX enhancements after content is loaded
    setTimeout(() => {
      const mobileUX = new MobileUXManager();
      console.log('Mobile UX: Enhancements initialized', mobileUX.getCollapsedInfo());
    }, 1000);
    
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