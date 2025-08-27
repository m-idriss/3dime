/* =========================
   Load content from JSON
   ========================= */
async function loadContent() {
  const res = await fetch('content/content.json');
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

      // Handle special section types
      if (section.type === 'heatmap') {
        html += `<div id="${section.containerId || 'cal-heatmap'}" class="heatmap-container"></div>`;
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
  
  // Load commit activity heatmap
  loadHeatmap();
}

/* =========================
   Load Commit Activity Heatmap
   ========================= */
async function loadHeatmap() {
  try {
    let data;
    
    // Try to fetch from proxy first
    try {
      const response = await fetch('proxy.php?service=github&type=commits');
      if (response.ok) {
        data = await response.json();
      } else {
        throw new Error('Proxy not available');
      }
    } catch (proxyError) {
      console.log('Proxy unavailable, using mock data for demonstration');
      // Generate mock commit data for demonstration
      data = generateMockCommitData();
    }
    
    console.log('GitHub commit data:', data);
    
    if (data.commit_activity && typeof CalHeatmap !== 'undefined') {
      // Transform data for Cal-Heatmap format
      const heatmapData = {};
      Object.entries(data.commit_activity).forEach(([date, commits]) => {
        // Cal-Heatmap expects timestamps in seconds, not milliseconds
        const timestamp = Math.floor(new Date(date).getTime() / 1000);
        heatmapData[timestamp] = commits;
      });
      
      // Initialize Cal-Heatmap
      const cal = new CalHeatmap();
      cal.init({
        itemSelector: '#commit-heatmap',
        domain: 'month',
        subDomain: 'day',
        data: heatmapData,
        start: new Date(Date.now() - (365 * 24 * 60 * 60 * 1000)), // 1 year ago
        cellSize: 12,
        cellPadding: 2,
        range: 12, // Show 12 months
        legend: [1, 2, 4, 8], // Thresholds for different colors
        legendColors: {
          min: '#161b22',
          max: '#39d353',
          empty: '#161b22',
          base: '#0d1117'
        },
        tooltip: true,
        onClick: function(date, nb) {
          if (nb > 0) {
            console.log(`${nb} commits on ${new Date(date * 1000).toDateString()}`);
          }
        }
      });
    } else if (data.commit_activity) {
      // Fallback: create a simple visual representation if Cal-Heatmap is not available
      createSimpleHeatmap(data.commit_activity);
    } else {
      console.warn('No commit data available');
      // Fallback: show a simple message
      const container = document.getElementById('commit-heatmap');
      if (container) {
        container.innerHTML = '<p class="heatmap-fallback">Commit activity data unavailable</p>';
      }
    }
  } catch (error) {
    console.error('Error loading heatmap:', error);
    // Fallback: show error message
    const container = document.getElementById('commit-heatmap');
    if (container) {
      container.innerHTML = '<p class="heatmap-fallback">Unable to load commit activity</p>';
    }
  }
}

/* =========================
   Generate Mock Commit Data
   ========================= */
function generateMockCommitData() {
  const commitActivity = {};
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
  
  // Generate data for the past year
  for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    // Random commits (weighted towards weekdays, some days with no commits)
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const baseProb = isWeekend ? 0.3 : 0.7;
    const hasCommits = Math.random() < baseProb;
    commitActivity[dateStr] = hasCommits ? Math.floor(Math.random() * 8) + 1 : 0;
  }
  
  return { commit_activity: commitActivity };
}

/* =========================
   Simple Heatmap Fallback
   ========================= */
function createSimpleHeatmap(commitData) {
  const container = document.getElementById('commit-heatmap');
  if (!container) return;
  
  // Create a simplified grid representation
  let html = '<div class="simple-heatmap">';
  html += '<p style="margin-bottom: 1rem; color: var(--text-secondary); font-size: 0.9rem;">Commit activity (past year) - Cal-Heatmap library unavailable</p>';
  html += '<div class="simple-heatmap-grid">';
  
  const sortedDates = Object.keys(commitData).sort();
  const recentDates = sortedDates.slice(-84); // Show last 12 weeks
  
  recentDates.forEach(date => {
    const commits = commitData[date];
    let intensity = 'empty';
    if (commits > 0) {
      if (commits <= 2) intensity = 'low';
      else if (commits <= 4) intensity = 'medium';
      else if (commits <= 6) intensity = 'high';
      else intensity = 'very-high';
    }
    
    html += `<div class="simple-heatmap-day ${intensity}" title="${date}: ${commits} commits"></div>`;
  });
  
  html += '</div>';
  html += '<div class="simple-heatmap-legend">';
  html += '<span style="font-size: 0.8rem; color: var(--text-secondary);">Less</span>';
  html += '<div class="legend-colors">';
  html += '<div class="legend-color empty"></div>';
  html += '<div class="legend-color low"></div>';
  html += '<div class="legend-color medium"></div>';
  html += '<div class="legend-color high"></div>';
  html += '<div class="legend-color very-high"></div>';
  html += '</div>';
  html += '<span style="font-size: 0.8rem; color: var(--text-secondary);">More</span>';
  html += '</div>';
  html += '</div>';
  
  container.innerHTML = html;
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
