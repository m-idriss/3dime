/* =========================
   CDN Fallback Manager
   Provides local fallbacks for external dependencies
   ========================= */

/* =========================
   Configuration
   ========================= */
const CDN_FALLBACKS = {
  // Font Awesome fallback
  fontAwesome: {
    cdn: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css',
    check: () => {
      // Check if Font Awesome is loaded by testing for a known class
      const testElement = document.createElement('i');
      testElement.className = 'fas fa-check';
      testElement.style.display = 'none';
      document.body.appendChild(testElement);
      const isLoaded = window.getComputedStyle(testElement, ':before').content !== 'none';
      document.body.removeChild(testElement);
      return isLoaded;
    },
    fallback: () => {
      console.log('CDN Fallback: Font Awesome failed, using local icons');
      // Create minimal icon fallbacks using CSS
      const fallbackCSS = `
        /* Minimal icon fallbacks */
        .fa-github:before, .fa-brands.fa-github:before { content: "⚙"; }
        .fa-linkedin:before, .fa-brands.fa-linkedin:before { content: "🔗"; }
        .fa-x-twitter:before, .fa-brands.fa-x-twitter:before { content: "🐦"; }
        .fa-facebook-square:before, .fa-brands.fa-facebook-square:before { content: "📘"; }
        .fa-instagram:before, .fa-brands.fa-instagram:before { content: "📷"; }
        .fa-photo-film:before, .fa-solid.fa-photo-film:before { content: "🎬"; }
        .fa-bell:before { content: "🔔"; }
        .fa-globe:before { content: "🌐"; }
        .fa-chevron-right:before { content: "▶"; }
        .fa-chevron-down:before { content: "▼"; }
        .fa-bars:before { content: "☰"; }
        .fa-times:before { content: "✕"; }
        .fa, .fas, .fa-brands, .fa-solid { 
          font-family: inherit;
          font-style: normal;
          font-weight: normal;
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
        }
      `;
      
      const style = document.createElement('style');
      style.textContent = fallbackCSS;
      document.head.appendChild(style);
    }
  },

  // D3.js fallback
  d3: {
    cdn: 'https://d3js.org/d3.v7.min.js',
    check: () => typeof window.d3 !== 'undefined',
    fallback: () => {
      console.log('CDN Fallback: D3.js failed, disabling heatmap');
      // Gracefully disable heatmap functionality
      const heatmapContainer = document.getElementById('heatmap-container');
      if (heatmapContainer) {
        heatmapContainer.innerHTML = '<p>GitHub Activity heatmap unavailable offline</p>';
      }
    }
  },

  // Cal-heatmap fallback  
  calHeatmap: {
    cdn: 'https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js',
    check: () => typeof window.CalHeatmap !== 'undefined',
    fallback: () => {
      console.log('CDN Fallback: Cal-heatmap failed, using placeholder');
      const heatmapContainer = document.getElementById('heatmap-container');
      if (heatmapContainer) {
        heatmapContainer.innerHTML = `
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; text-align: center;">
            <p>📊 GitHub Activity visualization requires internet connection</p>
            <p><small>Visit <a href="https://github.com/m-idriss" target="_blank" rel="noopener noreferrer">github.com/m-idriss</a> to see activity</small></p>
          </div>
        `;
      }
    }
  },

  // Google Fonts fallback
  googleFonts: {
    cdn: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
    check: () => {
      const testElement = document.createElement('div');
      testElement.style.fontFamily = 'Inter, sans-serif';
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      testElement.textContent = 'Test';
      document.body.appendChild(testElement);
      const computedFont = window.getComputedStyle(testElement).fontFamily;
      document.body.removeChild(testElement);
      return computedFont.includes('Inter');
    },
    fallback: () => {
      console.log('CDN Fallback: Google Fonts failed, using system fonts');
      const fallbackCSS = `
        body, * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }
      `;
      
      const style = document.createElement('style');
      style.textContent = fallbackCSS;
      document.head.appendChild(style);
    }
  }
};

/* =========================
   Fallback Manager
   ========================= */
class FallbackManager {
  constructor() {
    this.checkTimeout = 3000; // 3 seconds timeout for CDN checks
    this.checkedFallbacks = new Set();
  }

  /**
   * Initialize fallback checks after DOM is loaded
   */
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.checkAllFallbacks());
    } else {
      this.checkAllFallbacks();
    }
  }

  /**
   * Check all registered fallbacks
   */
  async checkAllFallbacks() {
    console.log('Fallback Manager: Checking CDN dependencies...');
    
    // Wait a bit for CDN resources to load
    await this.delay(1000);
    
    for (const [name, config] of Object.entries(CDN_FALLBACKS)) {
      if (!this.checkedFallbacks.has(name)) {
        this.checkFallback(name, config);
      }
    }
  }

  /**
   * Check individual fallback
   */
  checkFallback(name, config) {
    this.checkedFallbacks.add(name);
    
    try {
      if (!config.check()) {
        console.warn(`CDN Fallback: ${name} not available, applying fallback`);
        config.fallback();
      } else {
        console.log(`CDN Fallback: ${name} loaded successfully`);
      }
    } catch (error) {
      console.error(`CDN Fallback: Error checking ${name}:`, error);
      config.fallback();
    }
  }

  /**
   * Utility: Promise-based delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Force fallback for specific dependency
   */
  forceFallback(name) {
    const config = CDN_FALLBACKS[name];
    if (config) {
      console.log(`CDN Fallback: Forcing fallback for ${name}`);
      config.fallback();
    }
  }

  /**
   * Re-check specific dependency
   */
  recheckFallback(name) {
    const config = CDN_FALLBACKS[name];
    if (config) {
      this.checkedFallbacks.delete(name);
      this.checkFallback(name, config);
    }
  }
}

/* =========================
   Global Instance
   ========================= */
window.fallbackManager = new FallbackManager();

/* =========================
   Export for module usage
   ========================= */
export { FallbackManager, CDN_FALLBACKS };