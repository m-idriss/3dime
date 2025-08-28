/* =========================
   Heatmap Loading
   ========================= */

import { CONFIG } from './config.js';

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