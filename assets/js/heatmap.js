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
  try {
    // Wait for external libraries to be ready
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
  } catch (err) {
    console.warn('Heatmap initialization failed:', err.message);
    // Show user-friendly fallback message
    showHeatmapFallback();
  }
}

function showHeatmapFallback() {
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (container) {
    container.innerHTML = `
      <div class="heatmap-fallback" role="alert" aria-live="polite">
        <p>🔗 <a href="https://github.com/m-idriss" target="_blank" rel="noopener noreferrer" 
           aria-label="View GitHub profile for commit activity">
           View GitHub activity
        </a></p>
      </div>
    `;
  }
}

// Store heatmap data and instance for re-rendering
let heatmapData = null;
let heatmapInstance = null;

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