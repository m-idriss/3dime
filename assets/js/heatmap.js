/* =========================
   Heatmap Loading
   ========================= */

import { CONFIG } from './config.js';

/* =========================
   Theme Detection Helper
   ========================= */
function getHeatmapTheme() {
  // Check current website theme and map to appropriate heatmap theme
  if (document.body.classList.contains('white-theme')) {
    return 'light';
  }
  // For dark-theme and glass-theme (or default), use dark heatmap theme
  return 'dark';
}

/* =========================
   Library Readiness Check
   ========================= */
function waitForLibraries(timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkLibraries = () => {
      if (typeof CalHeatmap !== 'undefined' && 
          typeof CalendarLabel !== 'undefined' && 
          typeof Tooltip !== 'undefined') {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for libraries to load'));
      } else {
        setTimeout(checkLibraries, 100);
      }
    };
    checkLibraries();
  });
}

/* =========================
   Heatmap Loading with Retry
   ========================= */
export async function loadHeatmapWithRetry(retries = 3, delay = 5000) {
  // First, try to load data regardless of library availability
  try {
    // Check if we're in development mode (PHP server might be on different port)
    let proxyUrl = `${CONFIG.ENDPOINTS.PROXY}?service=github&type=commits`;
    
    // Try PHP dev server if main proxy fails
    let response = await fetch(proxyUrl);
    if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
      // Fallback to PHP dev server on localhost:8080
      proxyUrl = `http://localhost:8080/config/proxy.php?service=github&type=commits`;
      response = await fetch(proxyUrl);
    }
    
    let data;
    if (!response.ok) {
      // If API fails, check if it's a rate limit or API access issue
      if (response.status === 403 || response.status === 429) {
        console.warn('GitHub API rate limited or access restricted');
        showHeatmapDataFallback('GitHub API rate limited - showing demo data', createMockHeatmapData());
        return;
      }
      throw new Error(`Failed to fetch commit data: ${response.status}`);
    }
    
    try {
      data = await response.json();
    } catch (jsonErr) {
      // If JSON parsing fails, it means the proxy returned HTML (PHP not executing)
      console.warn('Proxy returned HTML instead of JSON - using demo data');
      showHeatmapDataFallback('API proxy unavailable - showing demo data', createMockHeatmapData());
      return;
    }
    
    const commitActivity = data.commit_activity;
    
    if (!commitActivity || !Array.isArray(commitActivity)) {
      console.warn('No commit activity data available');
      showHeatmapDataFallback('No commit activity data available');
      return;
    }

    // Store data for potential future use
    heatmapData = commitActivity.flatMap(week =>
      week.days.map((value, i) => {
        const date = new Date((week.week + i * 86400) * 1000)
          .toISOString()
          .split("T")[0];
        return { date, value };
      })
    );

    // Try to render with libraries if available
    try {
      await waitForLibraries();
      renderHeatmap(heatmapData);
      return; // Success with full heatmap
    } catch (libErr) {
      console.warn('Heatmap libraries not available, showing data summary');
      showHeatmapDataFallback('Heatmap libraries unavailable', heatmapData);
      return;
    }
    
  } catch (dataErr) {
    console.warn('Failed to fetch heatmap data:', dataErr.message);
    
    // Try with libraries for basic fallback
    try {
      await waitForLibraries();
      for (let i = 0; i < retries; i++) {
        try {
          await loadHeatmap();
          return; // success → stop retrying
        } catch (err) {
          console.warn(`Heatmap load failed (attempt ${i + 1}/${retries})`, err);
          if (i < retries - 1) {
            await new Promise(res => setTimeout(res, delay));
          }
        }
      }
    } catch (libErr) {
      console.warn('Heatmap libraries not available');
    }
    
    // Final fallback
    showHeatmapFallback(dataErr.message);
  }
}

function showHeatmapFallback(errorMessage = '') {
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (container) {
    const errorDetail = errorMessage ? ` (${errorMessage})` : '';
    container.innerHTML = `
      <div class="heatmap-fallback" role="alert" aria-live="polite">
        <p>⚠️ Unable to load GitHub activity${errorDetail}</p>
        <p>🔗 <a href="https://github.com/m-idriss" target="_blank" rel="noopener noreferrer" 
           aria-label="View GitHub profile for commit activity">
           View GitHub activity
        </a></p>
      </div>
    `;
  }
}

function showHeatmapDataFallback(message, data = null) {
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (container) {
    let html = `
      <div class="heatmap-fallback" role="alert" aria-live="polite">
        <p>📊 ${message}</p>
    `;
    
    if (data && Array.isArray(data)) {
      // Calculate some basic stats from the data
      const totalCommits = data.reduce((sum, entry) => sum + (entry.value || 0), 0);
      const daysWithCommits = data.filter(entry => entry.value > 0).length;
      const maxCommits = Math.max(...data.map(entry => entry.value || 0));
      
      html += `
        <div class="heatmap-stats" style="margin: 10px 0; font-size: 0.9em; color: rgba(255,255,255,0.8);">
          <p><strong>Activity Summary:</strong></p>
          <p>• Total commits: ${totalCommits}</p>
          <p>• Active days: ${daysWithCommits}</p>
          <p>• Most commits in a day: ${maxCommits}</p>
        </div>
      `;
    }
    
    html += `
        <p><small>Visit <a href="https://github.com/m-idriss" target="_blank" rel="noopener noreferrer">github.com/m-idriss</a> for full activity</small></p>
      </div>
    `;
    
    container.innerHTML = html;
  }
}

// Store heatmap data and instance for re-rendering
let heatmapData = null;
let heatmapInstance = null;

/* =========================
   Mock Data Generation for Development/Fallback
   ========================= */
function createMockHeatmapData() {
  const data = [];
  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  
  // Generate realistic commit pattern - more commits on weekdays, sporadic on weekends
  for (let d = new Date(threeMonthsAgo); d <= now; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    let baseActivity = 0;
    
    // Higher activity on weekdays
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      baseActivity = Math.random() * 8; // 0-8 commits on weekdays
    } else {
      baseActivity = Math.random() * 3; // 0-3 commits on weekends
    }
    
    // Add some randomness and occasional high-activity days
    let commits = Math.floor(baseActivity + (Math.random() > 0.9 ? Math.random() * 10 : 0));
    
    data.push({
      date: d.toISOString().split('T')[0],
      value: commits
    });
  }
  
  return data;
}

export async function loadHeatmap() {
  try {
    const response = await fetch(`${CONFIG.ENDPOINTS.PROXY}?service=github&type=commits`);
    if (!response.ok) {
      throw new Error(`Failed to fetch commit data: ${response.status}`);
    }
    
    const data = await response.json();
    const commitActivity = data.commit_activity;
    
    if (!commitActivity || !Array.isArray(commitActivity)) {
      console.warn('No commit activity data available');
      showHeatmapFallback();
      return;
    }

    const commitSource = commitActivity.flatMap(week =>
      week.days.map((value, i) => {
        const date = new Date((week.week + i * 86400) * 1000)
          .toISOString()
          .split("T")[0];
        return { date, value };
      })
    );

    // Store data for re-rendering
    heatmapData = commitSource;
    
    // Render the heatmap
    renderHeatmap(commitSource);

  } catch (error) {
    console.error('Error loading heatmap:', error);
    showHeatmapFallback();
  }
}

function renderHeatmap(commitSource) {
  // Clear loading state before rendering heatmap
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (container) {
    container.innerHTML = ''; // Clear loading indicator and any existing heatmap
  }

  const cal = new CalHeatmap();
  heatmapInstance = cal; // Store instance for potential future use
  
  cal.paint({
    itemSelector: CONFIG.SELECTORS.HEATMAP_CONTAINER,
    domain: {
      type: 'month',
      label: { text: 'MMM', textAlign: 'start', position: 'top'}
    },
    subDomain: { type: 'ghDay', radius: 2, width: 9, height: 9, gutter: 1, },
    data: {
      source: commitSource,
      x: d => new Date(d.date).getTime(),
      y: d => d.value
    },
    date: {
      start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      locale: { weekStart: 1 },
      highlight: [new Date()]
    },
    range: 7,
    scale: {
      color: {
        range: ['rgba(255, 255, 255, 0.2)', 'green'],
        interpolate: 'hsl',
        type: 'linear',
        domain: [0, 30],
      },
    },
    theme: getHeatmapTheme()
  },
  [
    [
      CalendarLabel,
      {
        position: 'left',
        key: 'left',
        text: () => ['Mon', '', '', 'Thu', '', '', 'Sun'],
        textAlign: 'end',
        width: 20,
        padding: [25, 5, 0, 0],
      },
    ],
    [
      Tooltip,
      {
        text: function (date, value, dayjsDate) {
          return (
            (value ? value + ' commits' : 'No commits') +
            ' on ' +
            dayjsDate.format('LL')
          );
        },
      },
    ]
  ]);
}

/* =========================
   Re-render Heatmap with Current Theme
   ========================= */
export function updateHeatmapTheme() {
  // Only re-render if we have data and the heatmap container exists
  if (heatmapData && document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER)) {
    renderHeatmap(heatmapData);
  }
}