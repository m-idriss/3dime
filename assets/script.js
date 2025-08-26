/* =========================
   Load content from JSON
   ========================= */
async function loadContent() {
  const res = await fetch('assets/content.json');
  const content = await res.json();

  const main = document.querySelector('.cards-container');

  content.groups.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('group-column');

    group.sections.forEach(section => {
      const container = document.createElement('section');
      container.classList.add('container');
      container.setAttribute('aria-label', section.name);

      let html = '';

      if (section.logo) {
        html += `<header>`;
        html += `<img src="${section.logo}" alt="Logo" class="logo">`;
        html += `</header>`;
      }

      if (section.title) html += `<h2>${section.title}</h2>`;
      if (section.description) html += `<p>${section.description}</p>`;

      // Handle heatmap section
      if (section.name === 'heatmap') {
        html += `<div id="commit-heatmap" class="heatmap-container"></div>`;
      }

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
  setupLogoReload();
  
  // Load heatmap after content is rendered
  loadHeatmap();
}


/* =========================
   Logo Reload
   ========================= */
function setupLogoReload() {
  const logos = document.querySelectorAll('.logo');
  logos.forEach(logo => {
    logo.addEventListener('click', () => {
      document.body.classList.add('fade-out');
      setTimeout(() => location.reload(), 400);
    });
  });
}

/* =========================
   Update Badge
   ========================= */
function updateBadge(service, badgeId, field, params = {}) {
    let url = `proxy.php?service=${service}`;

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

/* =========================
   Load Heatmap
   ========================= */
async function loadHeatmap() {
  try {
    // Check if heatmap container exists
    const container = document.getElementById('commit-heatmap');
    if (!container) return;

    // Generate sample commit data
    const commitData = generateSampleCommitData();
    
    // Create a simple grid-based heatmap
    createSimpleHeatmap(container, commitData);
    
  } catch (error) {
    console.error('Error loading heatmap:', error);
    // Fallback: show a message
    const container = document.getElementById('commit-heatmap');
    if (container) {
      container.innerHTML = '<p style="opacity: 0.7;">Heatmap temporarily unavailable</p>';
    }
  }
}

/* =========================
   Create Simple Heatmap
   ========================= */
function createSimpleHeatmap(container, data) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 months ago
  
  // Create heatmap HTML structure
  let heatmapHTML = '<div class="simple-heatmap">';
  heatmapHTML += '<div class="heatmap-months">';
  
  // Generate months labels and grid
  const months = [];
  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(startDate);
    monthDate.setMonth(startDate.getMonth() + i);
    months.push(monthDate);
  }
  
  // Create month headers
  months.forEach(month => {
    heatmapHTML += `<div class="month-label">${month.toLocaleDateString('en', { month: 'short' })}</div>`;
  });
  
  heatmapHTML += '</div>';
  heatmapHTML += '<div class="heatmap-grid">';
  
  // Create grid of days (simplified - just show current year)
  const daysInYear = 365;
  const currentDate = new Date(startDate);
  
  for (let day = 0; day < daysInYear; day++) {
    const dateKey = currentDate.toISOString().split('T')[0];
    const commitCount = data[dateKey] || 0;
    const intensity = commitCount > 0 ? Math.min(Math.ceil(commitCount / 2), 4) : 0;
    
    heatmapHTML += `<div class="heatmap-cell level-${intensity}" 
      title="${dateKey}: ${commitCount} commits" 
      data-date="${dateKey}" 
      data-count="${commitCount}"></div>`;
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  heatmapHTML += '</div>';
  
  // Add legend
  heatmapHTML += '<div class="heatmap-legend">';
  heatmapHTML += '<span class="legend-label">Less</span>';
  for (let i = 0; i <= 4; i++) {
    heatmapHTML += `<div class="legend-cell level-${i}"></div>`;
  }
  heatmapHTML += '<span class="legend-label">More</span>';
  heatmapHTML += '</div>';
  
  heatmapHTML += '</div>';
  
  container.innerHTML = heatmapHTML;
}

/* =========================
   Generate Sample Commit Data
   ========================= */
function generateSampleCommitData() {
  const data = {};
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  
  // Generate sample commit data for the past year
  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    // Random commits with some days having more activity
    const commits = Math.random() > 0.8 ? Math.floor(Math.random() * 8) + 1 : 0;
    if (commits > 0) {
      data[dateKey] = commits;
    }
  }
  
  return data;
}

/* =========================
   Service Worker
   ========================= */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('assets/sw.js')
    .then(() => console.log('SW registered'))
    .catch(err => console.log('SW failed', err));
}

/* =========================
   Page Fade-In
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded'); // fade-in
  loadContent(); // load content & trigger animations after DOM insertion
});
