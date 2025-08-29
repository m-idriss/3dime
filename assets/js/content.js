/* =========================
   Content Loading and Rendering
   ========================= */

import { CONFIG } from './config.js';
import { detectLanguage } from './language.js';
import { updateBadge } from './badges.js';
import { loadHeatmap } from './heatmap.js';
import { setupLogoReload, setupBurgerMenu } from './ui.js';

export async function loadContent() {
  const currentLang = detectLanguage();
  let content;
  try {
    const res = await fetch(`${CONFIG.ENDPOINTS.I18N}/${currentLang}.json`);
    if (!res.ok) {
      throw new Error(`Failed to load translation file: ${res.status} ${res.statusText}`);
    }
    content = await res.json();
  } catch (error) {
    // Display a user-friendly error message or fallback content
    const main = document.querySelector(CONFIG.SELECTORS.CARDS_CONTAINER);
    main.innerHTML = '<div class="error-message">Failed to load content. Please try again later.</div>';
    console.error('Error loading translation file:', error);
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
              <div class="profile-dropdown" id="profile-dropdown">
                <button class="dropdown-item theme-toggle" id="theme-toggle">
                  <i class="fas fa-moon"></i>
                  <span>${content.ui.darkMode}</span>
                  <div class="toggle-switch"></div>
                </button>
                <button class="dropdown-item notifications-toggle" id="notifications-toggle">
                  <i class="fas fa-bell"></i>
                  <span>Notifications</span>
                  <div class="toggle-switch"></div>
                </button>
                <div class="dropdown-separator"></div>
                <button class="dropdown-item language-toggle" id="language-toggle">
                  <i class="fas fa-globe"></i>
                  <span>${content.ui.language}</span>
                  <i class="fas fa-chevron-right dropdown-arrow"></i>
                </button>
                <div class="language-submenu" id="language-submenu">
                  <button class="dropdown-item language-option" data-lang="en">
                    <span>${content.ui.english}</span>
                  </button>
                  <button class="dropdown-item language-option" data-lang="fr">
                    <span>${content.ui.french}</span>
                  </button>
                </div>
                <button class="dropdown-item font-size-toggle" id="font-size-toggle">
                  <i class="fas fa-text-height"></i>
                  <span>Font Size: Normal</span>
                </button>
              </div>
            </div>
          `;
        }
        
        html += `</header>`;
      }

      if (section.title) html += `<h2>${section.title}</h2>`;
      if (section.description) html += `<p>${section.description}</p>`;

      if (section.items) {
        if (section.itemsClass) html += `<div class="${section.itemsClass}">`;

        html += section.items.map(item => {
          const classes = [];
          if (item.linkType) classes.push(item.linkType);
          if (!item.iconClass && item.name) classes.push('link');
          if (item.extraClasses) classes.push(...item.extraClasses.split(' '));

          let linkHtml = `<a href="${item.url}" target="_blank"`;
          if (classes.length) {
            linkHtml += ` class="${classes.join(' ')}"`;
          }
          linkHtml += '>';
          if (item.iconClass) linkHtml += `<i class="fa ${item.iconClass}"></i>`;
          if (!item.iconClass && item.name) linkHtml += item.name;
          if (item.badge) {
            const badgeId = item.badgeId ? ` id="${item.badgeId}"` : '';
            linkHtml += `<span class="badge"${badgeId} style="display: none;">${item.badge}</span>`;
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
    loadHeatmap();
  }
  
  setupLogoReload();
  setupBurgerMenu();
}