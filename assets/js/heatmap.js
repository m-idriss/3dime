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
export async function loadHeatmapWithRetry(retries = 3, delay = 1000) {
  try {
    // Wait for external libraries to be ready
    await waitForLibraries();
    
    for (let i = 0; i < retries; i++) {
      try {
        await loadHeatmap();
        
        // Add refresh button after successful load for user control
        setTimeout(() => {
          addRefreshButton();
        }, 500);
        
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

function showLoadingState() {
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (container) {
    container.innerHTML = `
      <div class="loading-container" role="status" aria-live="polite">
        <div class="spinner" aria-label="Loading heatmap">
          <div class="spinner-circle"></div>
        </div>
        <p>Loading GitHub activity...</p>
      </div>
    `;
  }
}

function showUpdatingState() {
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (container) {
    // Show updating indicator without completely clearing the existing heatmap
    const existingContent = container.innerHTML;
    container.style.opacity = '0.5';
    
    // Add a small update indicator
    const updateIndicator = document.createElement('div');
    updateIndicator.className = 'update-indicator';
    updateIndicator.innerHTML = `
      <div class="update-spinner" aria-label="Updating heatmap">
        <div class="spinner-circle"></div>
      </div>
    `;
    updateIndicator.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      border-radius: 4px;
      padding: 4px 8px;
      z-index: 10;
    `;
    
    // Make container relative if it isn't already
    if (container.style.position !== 'relative') {
      container.style.position = 'relative';
    }
    
    container.appendChild(updateIndicator);
  }
}

function clearUpdatingState() {
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (container) {
    container.style.opacity = '1';
    const updateIndicator = container.querySelector('.update-indicator');
    if (updateIndicator) {
      updateIndicator.remove();
    }
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

export async function loadHeatmap(isUpdate = false) {
  try {
    // Show appropriate loading state
    if (isUpdate && heatmapData) {
      showUpdatingState();
    } else {
      showLoadingState();
    }
    
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
    
    // Clear any updating state before rendering
    if (isUpdate) {
      clearUpdatingState();
    }
    
    // Render the heatmap
    renderHeatmap(commitSource);

  } catch (error) {
    console.error('Error loading heatmap:', error);
    
    // Clear any updating state on error
    if (isUpdate) {
      clearUpdatingState();
    }
    
    showHeatmapFallback();
  }
}

function renderHeatmap(commitSource) {
  // Clear loading state and destroy previous instance before rendering heatmap
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (!container) return;
  
  // Destroy previous heatmap instance if it exists
  if (heatmapInstance) {
    try {
      heatmapInstance.destroy();
    } catch (error) {
      console.warn('Error destroying previous heatmap instance:', error);
    }
    heatmapInstance = null;
  }
  
  // Clear container completely
  container.innerHTML = '';
  
  // Force DOM update to ensure the container is cleared
  container.offsetHeight; // Trigger reflow
  
  try {
    const cal = new CalHeatmap();

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
    
    // Store the instance for future cleanup
    heatmapInstance = cal;
    
    // Ensure the rendered heatmap is visible
    setTimeout(() => {
      container.style.opacity = '1';
    }, 100);
    
  } catch (error) {
    console.error('Error rendering heatmap:', error);
    showHeatmapFallback();
  }
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

/* =========================
   Force Heatmap Update (for manual refresh)
   ========================= */
export async function updateHeatmap() {
  // Force refresh the heatmap data from GitHub
  await loadHeatmap(true);
}

/* =========================
   Add manual refresh button (for testing and user control)
   ========================= */
export function addRefreshButton() {
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (!container) return;
  
  // Check if refresh button already exists
  if (container.querySelector('.heatmap-refresh-btn')) return;
  
  const refreshBtn = document.createElement('button');
  refreshBtn.className = 'heatmap-refresh-btn';
  refreshBtn.innerHTML = '🔄 Refresh';
  refreshBtn.style.cssText = `
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 123, 255, 0.8);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
    z-index: 10;
    transition: background 0.2s;
  `;
  refreshBtn.title = 'Refresh GitHub activity data';
  
  refreshBtn.addEventListener('click', async () => {
    console.log('Manual heatmap refresh triggered');
    await updateHeatmap();
  });
  
  refreshBtn.addEventListener('mouseenter', () => {
    refreshBtn.style.background = 'rgba(0, 123, 255, 1)';
  });
  
  refreshBtn.addEventListener('mouseleave', () => {
    refreshBtn.style.background = 'rgba(0, 123, 255, 0.8)';
  });
  
  // Make container relative if it isn't already
  if (container.style.position !== 'relative') {
    container.style.position = 'relative';
  }
  
  container.appendChild(refreshBtn);
}