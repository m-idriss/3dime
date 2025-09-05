# 🧑‍💻 3dime Developer Guide

This guide provides comprehensive documentation for developers working on the 3dime personal social hub website.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Core Modules](#core-modules)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Deployment Process](#deployment-process)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture Overview

3dime follows a **hybrid architecture** with a static frontend and optional PHP backend services:

```
┌─────────────────────────────────────────┐
│            Static Frontend              │
├─────────────────────────────────────────┤
│ • Vanilla HTML5/CSS3/JavaScript         │
│ • ES6+ Modules (no build process)       │
│ • Progressive Web App (PWA)             │
│ • Service Worker for offline support    │
│ • JSON-LD structured data               │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│        Optional PHP Backend            │
├─────────────────────────────────────────┤
│ • Proxy services for external APIs      │
│ • GitHub API integration               │
│ • CORS handling & rate limit mgmt      │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│            External APIs                │
├─────────────────────────────────────────┤
│ • GitHub API (commit activity)          │
│ • Font Awesome CDN                      │
│ • Google Fonts CDN                      │
│ • Cal-heatmap CDN                       │
└─────────────────────────────────────────┘
```

### Key Design Principles

1. **Static-First Architecture** - Core functionality works without server-side processing
2. **Progressive Enhancement** - PHP services add enhanced features when available
3. **Graceful Degradation** - CDN failures and API outages don't break the site
4. **Mobile-First** - Responsive design prioritizes mobile experience
5. **Accessibility-First** - WCAG AA compliance by default
6. **Performance-Focused** - Minimal dependencies, optimized loading
7. **Hosting Flexibility** - Deploy on static hosts or PHP-enabled servers

## 📁 File Structure

```
3dime/
├── assets/
│   ├── js/
│   │   ├── main.js           # Application entry point
│   │   ├── config.js         # Configuration constants  
│   │   ├── content.js        # Content loading & rendering
│   │   ├── fallbacks.js      # CDN fallback management
│   │   ├── heatmap.js        # GitHub activity visualization
│   │   └── ui.js             # UI interactions & animations
│   ├── styles-enhanced.css   # Main stylesheet
│   ├── sw.js                 # Service worker
│   └── manifest.json         # PWA manifest
├── config/
│   ├── config.php.example    # PHP configuration template
│   └── proxy.php             # API proxy endpoint
├── services/
│   └── github.php            # GitHub API service
├── content/
│   └── content.json          # Legacy content (deprecated)
├── structured-data.jsonld    # Schema.org structured data
│   ├── styles-enhanced.css   # Main stylesheet with CSS variables
│   ├── sw.js                 # Service worker for PWA
│   ├── manifest.json         # PWA manifest
│   ├── logo.png              # Site logo
│   └── icons/                # PWA icons (various sizes)
├── structured-data.jsonld    # JSON-LD structured data
├── index.html                # Main HTML entry point
├── proxy.php                 # PHP proxy for GitHub API
├── robots.txt                # SEO crawler instructions
├── sitemap.xml               # SEO sitemap
└── favicon.ico               # Site favicon
```

## 🔧 Core Modules

### main.js - Application Bootstrap
**Purpose**: Application initialization and startup coordination

**Key Functions**:
- `registerServiceWorker()` - PWA service worker registration
- `initializeApp()` - Main app initialization with error handling
- Event listener for DOM ready state

**Dependencies**: `content.js`, `fallbacks.js`

### config.js - Configuration Management
**Purpose**: Centralized configuration and constants

**Key Exports**:
- `CONFIG.SUPPORTED_LANGUAGES` - Internationalization settings
- `CONFIG.SELECTORS` - CSS selectors for DOM manipulation
- `CONFIG.IDS` - Element IDs for direct access
- `CONFIG.ENDPOINTS` - API endpoint configurations

### content.js - Content Management
**Purpose**: Dynamic content loading from structured data

**Key Functions**:
- `loadContent()` - Main content loading orchestrator
- `sanitizeUrl()` - URL validation and security
- `sanitizeText()` - XSS prevention for user content
- Section creation functions (`createProfileSection()`, etc.)

**Security Features**:
- Input sanitization for all user content
- URL validation with protocol whitelist
- XSS prevention using safe DOM manipulation

### fallbacks.js - Resilience Management
**Purpose**: CDN failure detection and graceful degradation

**Key Features**:
- **FallbackManager** class for monitoring external dependencies
- Automatic detection of failed CDN loads
- Emoji-based icon fallbacks for Font Awesome
- System font fallbacks for Google Fonts
- User-friendly error messages for visualization failures

**Monitored Dependencies**:
- Font Awesome 7.0 (icons)
- Google Fonts Inter (typography)
- D3.js (data visualization)
- Cal-heatmap (activity visualization)

### heatmap.js - GitHub Integration
**Purpose**: GitHub activity visualization via PHP proxy

**Key Functions**:
- `loadHeatmapWithRetry()` - Robust GitHub API integration via `config/proxy.php`
- `waitForLibraries()` - Ensures Cal-heatmap library availability
- `renderHeatmap()` - Creates interactive commit activity visualization
- `updateHeatmapTheme()` - Dynamic theme switching
- Error handling for API failures and fallback display
- Retry logic with exponential backoff

**API Integration**:
- Uses `CONFIG.ENDPOINTS.PROXY?service=github&type=commits`
- Fetches commit activity data through PHP proxy
- Handles CORS and rate limiting gracefully
- Provides fallback link to GitHub profile on failure

### ui.js - User Interface
**Purpose**: Interactive UI components and theme management

**Key Features**:
- Theme switching (dark/white/glass modes)
- Responsive navigation and mobile interactions
- Smooth animations and micro-interactions
- Accessibility-compliant interactive elements

## 🔧 PHP Backend Services

### config/proxy.php - API Gateway
**Purpose**: Unified endpoint for external API calls

**Supported Services**:
- `?service=github` - GitHub user/repository data
- `?service=github&type=commits` - Commit activity for heatmap

**Features**:
- CORS handling for browser compatibility
- Rate limit management and error handling
- Authentication token support
- Graceful error responses with fallback data

### services/github.php - GitHub API Integration
**Purpose**: GitHub API wrapper with enhanced features

**Functions**:
- `fetchGithubData($type, $repo)` - Flexible GitHub data fetching
- User statistics (followers, repositories, etc.)
- Repository metrics (stars, forks, issues, etc.)
- Commit activity data for heatmap visualization
- Token-based authentication for higher rate limits

**Security**:
- Input validation and sanitization
- Repository name validation with regex
- Error code mapping and meaningful responses

### ui.js - User Interface
**Purpose**: Interactive UI components and animations

**Key Features**:
- Logo click reload functionality
- Mobile burger menu (if implemented)
- Smooth scroll animations
- Keyboard navigation support

## ⚙️ Development Workflow

### 1. Setup Development Environment

#### Option A: Static Mode (Basic Features)
```bash
# Clone the repository
git clone https://github.com/m-idriss/3dime.git
cd 3dime

# Start static development server
python3 -m http.server 8000
# OR
npx serve .

# Access the site
open http://localhost:8000
```

#### Option B: Enhanced Mode (All Features including PHP Services)
```bash
# Clone the repository  
git clone https://github.com/m-idriss/3dime.git
cd 3dime

# Copy configuration template
cp config/config.php.example config/config.php

# Edit config.php with your API credentials (optional)
nano config/config.php

# Start PHP development server
php -S localhost:8000

# Access the site
open http://localhost:8000
```

**Enhanced Mode Benefits**:
- ✅ GitHub activity heatmap visualization
- ✅ Real-time social media metrics  
- ✅ External API integration with rate limiting
- ✅ CORS handling for browser compatibility

**Required for Enhanced Mode**:
- PHP 7.4+ with curl extension
- Optional: GitHub API token for enhanced functionality

### 2. Making Changes

1. **Identify the Module**: Determine which module needs modification
2. **Follow Minimal Changes Principle**: Make smallest possible changes
3. **Test Immediately**: Verify changes work in browser
4. **Check Accessibility**: Ensure WCAG compliance maintained
5. **Validate Performance**: No significant impact on load times

### 3. Testing Checklist

**Core Functionality (Both Modes)**:
- ✅ Page loads completely with all content sections
- ✅ Social media links open in new tabs with `rel="noopener noreferrer"`
- ✅ Technology links navigate to correct external sites
- ✅ Email link opens mailto: correctly
- ✅ Logo click reloads the page
- ✅ Mobile responsive design works (375px+ viewport)
- ✅ Keyboard navigation functions properly
- ✅ Screen reader accessibility validated

**Enhanced Mode Additional Tests**:
- ✅ GitHub activity heatmap loads and displays correctly
- ✅ Heatmap fallback shows when PHP services unavailable
- ✅ API proxy endpoints respond correctly (`/config/proxy.php?service=github`)
- ✅ CORS headers allow browser requests
- ✅ Rate limiting and error handling work gracefully

**Console Validation**:
- ✅ Service Worker registers successfully (`SW registered`)
- ✅ CDN fallbacks trigger appropriately when blocked
- ✅ No JavaScript runtime errors
- ✅ Graceful error handling for failed API calls
- ✅ PHP errors logged appropriately (check server logs)

## 📏 Code Standards

### JavaScript

```javascript
// Use JSDoc comments for functions
/**
 * Brief description of function purpose
 * @param {string} param1 - Description of parameter
 * @returns {Promise<void>} Description of return value
 */
async function exampleFunction(param1) {
  // Implementation
}

// Use const/let, avoid var
const CONFIG_VALUE = 'constant';
let mutableValue = 'variable';

// Use async/await for promises
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw error;
}
```

### CSS

```css
/* Use CSS custom properties for theming */
:root {
  --primary-color: #3b82f6;
  --text-color: #ffffff;
  --transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Follow BEM-inspired naming for complex components */
.card {
  /* Base styles */
}

.card--featured {
  /* Modifier styles */
}

.card__title {
  /* Element styles */
}
```

### HTML

```html
<!-- Always include proper ARIA attributes -->
<button aria-label="Open navigation menu" role="button">
  <i class="fa fa-bars" aria-hidden="true"></i>
</button>

<!-- Use semantic HTML5 elements -->
<section role="region" aria-labelledby="tech-heading">
  <h2 id="tech-heading">Tech Stack</h2>
  <!-- Content -->
</section>

<!-- Include security attributes for external links -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
```

## 🧪 Testing Guidelines

### Browser Testing
- **Chrome/Chromium** (primary)
- **Firefox** (secondary)
- **Safari** (mobile testing)
- **Edge** (Windows compatibility)

### Device Testing
- **Desktop**: 1920x1080, 1366x768
- **Tablet**: 768x1024, 1024x768
- **Mobile**: 375x667, 414x896, 360x640

### Accessibility Testing
- **Screen Reader**: Test with NVDA (free) or VoiceOver (macOS)
- **Keyboard Navigation**: Tab through all interactive elements
- **Color Contrast**: Ensure 4.5:1 ratio minimum (WCAG AA)
- **Focus Indicators**: Visible focus rings on all interactive elements

### Performance Testing
- **Lighthouse Audit**: Aim for 95+ performance score
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Network Throttling**: Test on "Slow 3G" connection

## 🚀 Deployment Process

### Automatic Deployment
Changes to `main` branch trigger automatic FTP deployment via GitHub Actions.

**Workflow**: `.github/workflows/deploy-on-ftp.yml`
- Triggered on push to `main`
- Uploads all files via FTP
- No build process required (static files)
- Duration: ~30 seconds

### Manual Deployment
```bash
# Ensure all changes are committed
git add .
git commit -m "feat: describe your changes"
git push origin main

# Deployment happens automatically via GitHub Actions
```

### Environment Variables (GitHub Secrets)
- `FTP_SERVER` - FTP server hostname
- `FTP_USERNAME` - FTP username
- `FTP_PASSWORD` - FTP password
- `FTP_PATH` - Remote directory path (usually `/www/`)

## 🔍 Troubleshooting

### Common Issues

**CDN Resources Blocked**
```
Error: Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
```
**Solution**: This is expected in restricted environments. Fallback system handles gracefully.

**Service Worker Registration Failed**
```
Error: SW failed [error details]
```
**Solution**: Check HTTPS requirement for service workers in production.

**GitHub API Rate Limiting**
```
Error: GitHub API rate limit exceeded
```
**Solution**: Implement exponential backoff in `heatmap.js`.

**Font Loading Issues**
```
Warning: Google Fonts failed, using system fonts
```
**Solution**: System font fallback is automatic and expected.

### Debugging Tools

**Browser DevTools**:
- **Console**: Monitor JavaScript errors and fallback messages
- **Network**: Check CDN resource loading status
- **Application**: Verify service worker and PWA functionality
- **Lighthouse**: Performance and accessibility auditing

**Manual Testing Commands**:
```javascript
// Force fallback testing in browser console
window.fallbackManager.forceFallback('fontAwesome');
window.fallbackManager.forceFallback('d3');

// Re-check specific dependency
window.fallbackManager.recheckFallback('googleFonts');
```

## 📚 Additional Resources

- **Roadmap**: `ROADMAP.md` - Development priorities and timeline
- **Contributing**: `../CONTRIBUTING.md` - Contribution guidelines
- **Security**: `SECURITY.md` - Security policy and reporting
- **Site Review**: `SITE_REVIEW_RECOMMENDATIONS.md` - Detailed technical recommendations

---

**Last Updated**: January 2024  
**Maintainer**: Idriss Mohamady (@m-idriss)

For questions or clarifications, please open an issue or contact the maintainer.