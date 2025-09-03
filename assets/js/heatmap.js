/* =========================
   Heatmap Loading
   ========================= */

import { CONFIG } from './config.js';

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

    // Clear loading state before rendering heatmap
    const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
    if (container) {
      container.innerHTML = ''; // Clear loading indicator
    }

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
      range: 6,
      scale: {
        color: {
          range: ['rgba(255, 255, 255, 0.2)', 'green'],
          interpolate: 'hsl',
          type: 'linear',
          domain: [0, 30],
        },
      },
      theme: 'dark'
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

    // Post-process to apply different colors for future dates
    setTimeout(() => {
      applyFutureDateColors(commitSource);
    }, 100);

  } catch (error) {
    console.error('Error loading heatmap:', error);
    showHeatmapFallback();
  }
}

/* =========================
   Apply Future Date Colors
   ========================= */
function applyFutureDateColors(commitSource) {
  // Get today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find all heatmap rectangles/elements
  const heatmapContainer = document.querySelector(CONFIG.SELECTORS.HEATMAP_CONTAINER);
  if (!heatmapContainer) return;
  
  // Get all day elements (CalHeatmap uses rect elements for each day)
  const dayElements = heatmapContainer.querySelectorAll('rect[data-date]');
  
  dayElements.forEach(element => {
    const dateStr = element.getAttribute('data-date');
    if (!dateStr) return;
    
    const elementDate = new Date(dateStr);
    elementDate.setHours(0, 0, 0, 0);
    
    const isFuture = elementDate > today;
    
    if (isFuture) {
      // Get current fill color to determine intensity
      const currentFill = element.getAttribute('fill') || element.style.fill;
      
      // Parse the current green color and convert to teal
      if (currentFill && currentFill !== 'rgba(255, 255, 255, 0.2)') {
        // Find the corresponding commit data to get the value
        const commitData = commitSource.find(d => d.date === dateStr);
        const value = commitData ? commitData.value : 0;
        
        if (value > 0) {
          // Calculate intensity and apply teal color for future dates
          const intensity = Math.min(value / 30, 1);
          const alpha = 0.3 + intensity * 0.7;
          const tealColor = `rgba(20, 184, 166, ${alpha})`; // teal-500
          
          element.setAttribute('fill', tealColor);
          element.style.fill = tealColor;
        }
      }
    }
  });
}