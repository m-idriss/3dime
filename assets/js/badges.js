/* =========================
   Badge Updates
   ========================= */

import { CONFIG } from './config.js';

export function updateBadge(service, badgeId, field, params = {}) {
  let url = `${CONFIG.ENDPOINTS.PROXY}?service=${service}`;

  // Add additional parameters to URL
  Object.keys(params).forEach(key => {
    url += `&${key}=${encodeURIComponent(params[key])}`;
  });

  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Network response was not ok (${res.status})`);
      }
      return res.json();
    })
    .then(data => {
      console.log(`Data ${service}:`, data);
      const badge = document.getElementById(badgeId);
      const count = data[field] || 0;
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
      }
    })
    .catch(err => console.error(`Erreur ${service}:`, err));
}