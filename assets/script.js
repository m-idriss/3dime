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

      // Handle special section types
      if (section.type === 'heatmap') {
        html += `<div id="cal-heatmap-${section.name}" class="cal-heatmap-container"></div>`;
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
  
  // Initialize heatmaps if they exist
  loadHeatmap();
  
  setupLogoReload();
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
function loadHeatmap() {
    // Fetch commit activity data from GitHub API via proxy
    fetch('proxy.php?service=github&type=commits')
        .then(res => {
            if (!res.ok) {
                throw new Error(`Network response was not ok (${res.status})`);
            }
            return res.json();
        })
        .then(data => {
            console.log('GitHub commit data:', data);
            initializeHeatmap(data.commits || {});
        })
        .catch(err => {
            console.error('Error loading heatmap:', err);
            // Use mock data for demonstration when API fails
            console.log('Using mock data for demonstration');
            const mockCommits = generateMockCommitData();
            initializeHeatmap(mockCommits);
        });
}

/* =========================
   Initialize Heatmap
   ========================= */
function initializeHeatmap(commitData) {
    // Check if Cal-Heatmap library is available
    if (typeof CalHeatmap === 'undefined') {
        console.log('Cal-Heatmap library not available, creating CSS fallback');
        createCSSHeatmap(commitData);
        return;
    }
    
    // Initialize Cal-Heatmap
    const cal = new CalHeatmap();
    
    // Convert timestamps to the format Cal-Heatmap expects
    const heatmapData = {};
    Object.keys(commitData).forEach(timestamp => {
        // Convert Unix timestamp to Date for Cal-Heatmap
        const date = new Date(parseInt(timestamp) * 1000);
        const dateKey = date.getTime() / 1000; // Cal-Heatmap expects seconds
        heatmapData[dateKey] = commitData[timestamp];
    });
    
    cal.paint({
        itemSelector: "#cal-heatmap-heatmap",
        domain: "month",
        subDomain: "day",
        range: 12, // Show 12 months
        cellSize: 12,
        cellPadding: 2,
        domainGutter: 10,
        tooltip: true,
        legend: [1, 2, 4, 8],
        legendColors: {
            min: "#0d1117",      // GitHub dark background
            max: "#39d353",      // GitHub green
            empty: "#161b22",    // GitHub empty cell
            base: "#161b22"      // GitHub base color
        },
        data: heatmapData,
        afterLoadData: function(data) {
            // Transform data for Cal-Heatmap if needed
            return data;
        }
    });
}

/* =========================
   Create CSS Fallback Heatmap
   ========================= */
function createCSSHeatmap(commitData) {
    const container = document.getElementById('cal-heatmap-heatmap');
    if (!container) return;
    
    // Create a simple grid-based heatmap using CSS
    const now = new Date();
    const weekCount = 52; // Show last 52 weeks
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - (weekCount * 7));
    
    let html = '<div class="css-heatmap">';
    html += '<div class="heatmap-months">';
    
    // Generate weeks
    for (let week = 0; week < weekCount; week++) {
        html += '<div class="heatmap-week">';
        
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + (week * 7) + day);
            
            const timestamp = Math.floor(currentDate.getTime() / 1000);
            const commits = commitData[timestamp] || 0;
            
            let intensity = 'empty';
            if (commits > 0 && commits <= 2) intensity = 'low';
            else if (commits > 2 && commits <= 5) intensity = 'medium';
            else if (commits > 5 && commits <= 8) intensity = 'high';
            else if (commits > 8) intensity = 'very-high';
            
            const title = `${commits} commits on ${currentDate.toLocaleDateString()}`;
            html += `<div class="heatmap-day ${intensity}" title="${title}" data-commits="${commits}"></div>`;
        }
        
        html += '</div>';
    }
    
    html += '</div>';
    
    // Add legend
    html += '<div class="heatmap-legend">';
    html += '<span class="legend-label">Less</span>';
    html += '<div class="legend-squares">';
    html += '<div class="legend-square empty"></div>';
    html += '<div class="legend-square low"></div>';
    html += '<div class="legend-square medium"></div>';
    html += '<div class="legend-square high"></div>';
    html += '<div class="legend-square very-high"></div>';
    html += '</div>';
    html += '<span class="legend-label">More</span>';
    html += '</div>';
    
    html += '</div>';
    
    container.innerHTML = html;
}

/* =========================
   Generate Mock Commit Data
   ========================= */
function generateMockCommitData() {
    const mockData = {};
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    // Generate random commits over the past year
    for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
        const timestamp = Math.floor(d.getTime() / 1000);
        // Random commit activity (0-10 commits per day, with some days having no commits)
        if (Math.random() > 0.3) { // 70% chance of having commits on any given day
            mockData[timestamp] = Math.floor(Math.random() * 10) + 1;
        }
    }
    
    return mockData;
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
