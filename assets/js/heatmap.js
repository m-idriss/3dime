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
  }
  
  // All retries failed or libraries timeout, show fallback message
  const container = document.getElementById(CONFIG.SELECTORS.HEATMAP_CONTAINER.slice(1));
  if (container) {
    container.innerHTML = '<p class="error-message">Unable to load commit activity</p>';
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

  } catch (error) {
    console.error('Error loading heatmap:', error);
    const container = document.getElementById(CONFIG.SELECTORS.HEATMAP_CONTAINER.slice(1));
    if (container) {
      container.innerHTML = '<p class="error-message">Unable to load commit activity</p>';
    }
  }
}