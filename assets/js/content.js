/* =========================
   Content Loading and Rendering
   ========================= */

import { CONFIG } from './config.js';
import { detectLanguage } from './language.js';
import { updateBadge } from './badges.js';
import { loadHeatmapWithRetry } from './heatmap.js';
import { setupLogoReload, setupBurgerMenu } from './ui.js';

/* =========================
   Security Utilities
   ========================= */
function sanitizeUrl(url) {
  try {
    const urlObj = new URL(url);
    // Only allow http, https, and mailto protocols
    if (!['http:', 'https:', 'mailto:'].includes(urlObj.protocol)) {
      console.warn('Invalid protocol:', urlObj.protocol);
      return '#';
    }
    return urlObj.toString();
  } catch (error) {
    console.warn('Invalid URL:', url);
    return '#';
  }
}

function sanitizeText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export async function loadContent() {
  const currentLang = detectLanguage();
  let content;
  try {
    // Parse JSON-LD structured data from the document head
    const ldJsonScript = document.querySelector('script[type="application/ld+json"]');
    if (!ldJsonScript) {
      throw new Error('JSON-LD structured data not found');
    }
    const ldData = JSON.parse(ldJsonScript.textContent);
    
    // Extract content for the current language from the JSON-LD
    if (!ldData._siteContent || !ldData._siteContent.languages || !ldData._siteContent.languages[currentLang]) {
      throw new Error(`Content for language '${currentLang}' not found in JSON-LD`);
    }
    content = ldData._siteContent.languages[currentLang];
  } catch (error) {
    // Display a user-friendly error message or fallback content
    const main = document.querySelector(CONFIG.SELECTORS.CARDS_CONTAINER);
    main.innerHTML = '<div class="error-message">Failed to load content. Please try again later.</div>';
    console.error('Error loading content from JSON-LD:', error);
    return;
  }

  const main = document.querySelector(CONFIG.SELECTORS.CARDS_CONTAINER);
  main.innerHTML = ''; // Clear existing content before loading new content

  content.groups.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('group-column');

    group.sections.forEach(section => {
      const container = document.createElement('section');
      container.classList.add('container');
      container.setAttribute('aria-label', section.name);
      
      // Add ID for profile section to support skip link
      if (section.name === 'profile') {
        container.id = 'profile-section';
      }

      let html = '';

      if (section.logo) {
        html += `<header class="profile-header">`;
        html += `<img src="${section.logo}" alt="Logo" class="logo">`;
        
        // Add burger menu for profile section
        if (section.name === 'profile') {
          html += `
            <div class="burger-menu">
              <button class="burger-button" id="burger-btn" aria-label="Profile options">
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <div class="profile-dropdown" id="profile-dropdown" role="menu" aria-labelledby="burger-btn">
                <button class="dropdown-item theme-toggle" id="theme-toggle" role="menuitem" aria-label="Toggle dark/light theme">
                  <i class="fas fa-moon" aria-hidden="true"></i>
                  <span>${content.ui.darkMode}</span>
                  <div class="toggle-switch" aria-hidden="true"></div>
                </button>
                <button class="dropdown-item notifications-toggle" id="notifications-toggle" role="menuitem" aria-label="Toggle notifications">
                  <i class="fas fa-bell" aria-hidden="true"></i>
                  <span>Notifications</span>
                  <div class="toggle-switch" aria-hidden="true"></div>
                </button>
                <div class="dropdown-separator" role="separator"></div>
                <button class="dropdown-item language-toggle" id="language-toggle" role="menuitem" aria-label="Select language" aria-expanded="false" aria-haspopup="true">
                  <i class="fas fa-globe" aria-hidden="true"></i>
                  <span>${content.ui.language}</span>
                  <i class="fas fa-chevron-right dropdown-arrow" aria-hidden="true"></i>
                </button>
                <div class="language-submenu" id="language-submenu" role="menu" aria-labelledby="language-toggle">
                  <button class="dropdown-item language-option" data-lang="en" role="menuitem" aria-label="Switch to English">
                    <span>${content.ui.english}</span>
                  </button>
                  <button class="dropdown-item language-option" data-lang="fr" role="menuitem" aria-label="Switch to French">
                    <span>${content.ui.french}</span>
                  </button>
                </div>
                <button class="dropdown-item font-size-toggle" id="font-size-toggle" role="menuitem" aria-label="Change font size">
                  <i class="fas fa-text-height" aria-hidden="true"></i>
                  <span>Font Size: Normal</span>
                </button>
              </div>
            </div>
          `;
        }
        
        html += `</header>`;
      }

      if (section.title) html += `<h2>${sanitizeText(section.title)}</h2>`;
      if (section.description) html += `<p>${sanitizeText(section.description)}</p>`;

      if (section.items) {
        if (section.itemsClass) html += `<div class="${section.itemsClass}">`;

        html += section.items.map(item => {
          const classes = [];
          if (item.linkType) classes.push(item.linkType);
          if (!item.iconClass && item.name) classes.push('link');
          if (item.extraClasses) classes.push(...item.extraClasses.split(' '));

          let linkHtml = `<a href="${sanitizeUrl(item.url)}" target="_blank" rel="noopener noreferrer"`;
          if (classes.length) {
            linkHtml += ` class="${classes.join(' ')}"`;
          }
          linkHtml += '>';
          if (item.iconClass) linkHtml += `<i class="fa ${item.iconClass}" aria-hidden="true"></i>`;
          if (!item.iconClass && item.name) linkHtml += sanitizeText(item.name);
          if (item.badge) {
            const badgeId = item.badgeId ? ` id="${item.badgeId}"` : '';
            linkHtml += `<span class="badge"${badgeId} style="display: none;" aria-label="Badge count">${sanitizeText(item.badge)}</span>`;
          }
          linkHtml += `</a>`;
          return item.wrapperClass ? `<div class="${item.wrapperClass}">${linkHtml}</div>` : linkHtml;
        }).join('');

        if (section.itemsClass) html += `</div>`;
      }

      // Handle heatmap section type
      if (section.type === 'heatmap') {
        html += `<div id="heatmap-container" class="heatmap-container"></div>`;
      }

      container.innerHTML = html;
      groupDiv.appendChild(container);
    });

    main.appendChild(groupDiv);
  });

  // All content loaded - fetch different GitHub metrics
  // Repository metrics (stars are more meaningful for badges than repo ID)
  updateBadge('github', 'badge-github', 'repos', { type: 'user' });
  updateBadge('trakt', 'badge-trakt', 'movies');
  updateBadge('x', 'badge-twitter', 'followers');
  
  // Load heatmap if container exists
  const heatmapContainer = document.getElementById(CONFIG.SELECTORS.HEATMAP_CONTAINER.slice(1));
  if (heatmapContainer) {
    loadHeatmapWithRetry();
  }
  
  setupLogoReload();
  setupBurgerMenu();
}