# 3dime - Personal Social Hub Website

3dime is a hybrid static frontend with optional PHP backend services, serving as a personal social hub to regroup and share profiles & links in one place. It's built with vanilla HTML5, CSS3, and JavaScript with Progressive Web App (PWA) features.

**Architecture**: The project follows a static-first approach where core functionality works without server-side processing, while optional PHP services provide enhanced features like GitHub activity heatmaps and real-time social metrics.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Run the Application

The project supports two modes:

#### Static Mode (Basic Features)
**NO BUILD PROCESS REQUIRED** - Core features work with static files only.

- **Start local development server:**
  ```bash
  cd /home/runner/work/3dime/3dime
  python3 -m http.server 8000
  ```
  - Server starts immediately (<1 second)
  - Access at `http://localhost:8000`
  - **NEVER CANCEL** - Server runs continuously until stopped

#### Enhanced Mode (All Features)
**PHP BACKEND SERVICES** - Additional features with API integration.

- **Start PHP development server:**
  ```bash
  cd /home/runner/work/3dime/3dime
  php -S localhost:8000
  ```
  - Enables GitHub heatmap, social metrics, and API proxy services
  - Requires PHP 7.4+ with curl extension
  - Optional: API tokens for enhanced functionality

- **Test the website:**
  - Open `http://localhost:8000` in browser  
  - Website loads in <2 seconds locally
  - All links and interactions should work
  - Logo click reloads the page (expected behavior)
  - Enhanced mode: GitHub heatmap should load (if configured)

### No Build, Test, or Lint Commands for Frontend
- **There is NO package.json, npm, webpack, or build tools**
- **There are NO automated tests**
- **There are NO linting tools configured**
- This is a hybrid static website with optional PHP backend services

## Validation

### Manual Validation Requirements
**ALWAYS perform these validation steps after making ANY changes:**

#### Basic Validation (Static Mode)
1. **Start local server:**
   ```bash
   python3 -m http.server 8000
   ```

2. **Load and test the website:**
   - Navigate to `http://localhost:8000`
   - Verify page loads completely with all content sections
   - Test social media links in the profile section
   - Click on technology chips (Java, JavaScript, etc.)
   - Test company/project links in experience section
   - Click contact email link
   - **Test logo click** - should reload the page

#### Enhanced Validation (PHP Mode)
1. **Start PHP server:**
   ```bash
   php -S localhost:8000
   ```

2. **Test PHP services:**
   - Verify GitHub heatmap loads in the profile section
   - Test API proxy: `curl "http://localhost:8000/config/proxy.php?service=github"`
   - Check that enhanced features work or fail gracefully

3. **Test responsive design:**
   - Resize browser window to mobile viewport (375x667)
   - Verify layout adapts correctly
   - Test navigation on mobile view

4. **Check browser console:**
   - Expected errors when running locally:
     - `Failed to load resource: net::ERR_BLOCKED_BY_CLIENT` (Font Awesome, Google Fonts)
     - `Error fetching GitHub data: TypeError: Failed to fetch` (GitHub API - in restricted environments)
     - These are normal in restricted environments and work in production

5. **Expected console success:**
   - `SW registered` (Service Worker)
   - No JavaScript runtime errors

### Complete User Scenarios to Test
**Execute these workflows after making changes:**

1. **Profile interaction flow:**
   - Load homepage → View profile section → Click GitHub link → Verify opens in new tab
   
2. **Content browsing flow:**
   - Load homepage → Scroll through all sections → Click various technology links → Verify external navigation
   
3. **Contact flow:**
   - Load homepage → Scroll to contact section → Click email link → Verify mailto opens

4. **Mobile experience flow:**
   - Resize to mobile → Test all interactions → Verify responsive layout

## Repository Structure

### Key Files and Directories
```
/home/runner/work/3dime/3dime/
├── index.html                    # Main entry point
├── structured-data.jsonld        # Schema.org structured data (primary content)
├── assets/
│   ├── js/                      # JavaScript modules (ES6+)
│   │   ├── main.js             # Application entry point
│   │   ├── config.js           # Configuration constants
│   │   ├── content.js          # Content loading & rendering
│   │   ├── heatmap.js          # GitHub activity visualization
│   │   └── ui.js               # User interface interactions
│   ├── styles-enhanced.css     # Main stylesheet
│   ├── sw.js                   # Service worker for PWA
│   ├── manifest.json           # PWA manifest
│   ├── background.jpg          # Background image
│   ├── logo.png                # Site logo
│   └── icons/                  # PWA icons (16, 192, 512px)
├── config/
│   ├── config.php.example      # PHP configuration template
│   └── proxy.php               # API proxy endpoint
├── services/
│   ├── github.php              # GitHub API service
├── docs/
│   ├── DEVELOPER_GUIDE.md      # Technical documentation
│   ├── PHP_SETUP_GUIDE.md      # PHP backend setup guide
│   └── [other documentation]
├── content/
│   └── content.json            # Legacy content (deprecated, use structured-data.jsonld)
├── .github/
│   └── workflows/
│       ├── deploy-on-ftp.yml      # Auto-deployment
│       └── update-screenshot.yml  # Screenshot generation
└── favicon.ico                 # Site favicon
```

### Content Management
- **Primary content**: Edit `structured-data.jsonld` (Schema.org format) to update:
  - Profile information and social links
  - Technology stack items (knowsAbout)
  - Work experience and projects
  - Education information
  - Personal hobbies and interests
  - Contact information

- **Enhanced features**: Configure `config/config.php` for:
  - GitHub API integration (activity heatmap)

- **Styling**: Edit `assets/styles-enhanced.css` for visual changes
- **Functionality**: Edit JavaScript modules in `assets/js/` for behavior changes
- **PWA settings**: Modify `assets/manifest.json` for app configuration
  - Education information
  - Personal recommendations and hobbies
  - Contact information

- **Edit styling**: Modify `assets/styles.css` for visual changes
- **Edit functionality**: Modify `assets/script.js` for behavior changes

## Deployment Process

### Automatic Deployment (Production)
- **Triggered by**: Push to `main` branch
- **Process**: GitHub Actions workflow uploads all files via FTP
- **Duration**: 10-30 seconds - **NEVER CANCEL**
- **No build step** - files copied directly to server

### Required GitHub Secrets (for deployment)
Set these in repository settings:
- `FTP_SERVER` - FTP server address
- `FTP_USERNAME` - FTP username  
- `FTP_PASSWORD` - FTP password
- `FTP_PATH` - Remote server path (usually `/www/`)

### Screenshot Generation
- **Triggered by**: Manual dispatch or daily schedule (6 AM)
- **Process**: Automated screenshot generation of live site
- **Duration**: ~30 seconds - **NEVER CANCEL**
- **Output**: Updates `assets/screenshots/` with desktop and mobile captures

## Development Guidelines

### Making Changes
1. **For content updates**: Edit `content/content.json`
2. **For styling changes**: Edit `assets/styles.css`
3. **For functionality changes**: Edit `assets/script.js`
4. **For PWA updates**: Edit `assets/manifest.json`

### Testing Your Changes
```bash
# Start local server
python3 -m http.server 8000

# In browser: http://localhost:8000
# Follow manual validation steps above
```

### Common File Locations
- **Profile content**: `content/content.json` → groups[0].sections[0]
- **Technology stack**: `content/content.json` → groups[0].sections[2].items
- **Social links**: `content/content.json` → groups[0].sections[0].items
- **Color scheme**: `assets/styles.css` → CSS custom properties
- **Animations**: `assets/script.js` → scroll animations and interactions

## Timing Expectations

### Development Operations
- **Server startup**: <1 second
- **Website load (local)**: <2 seconds  
- **Content changes**: Immediate (refresh browser)
- **Manual validation**: 2-3 minutes

### CI/CD Operations  
- **FTP deployment**: 10-30 seconds - **NEVER CANCEL**
- **Screenshot generation**: ~30 seconds - **NEVER CANCEL**
- **Workflow completion**: <2 minutes total

## Troubleshooting

### Expected Issues in Local Development
- **Font Awesome icons may not load** - External CDN blocked in restricted environments
- **Google Fonts may not load** - External CDN blocked  
- **GitHub API fails** - External API blocked
- **PWA features limited** - Requires HTTPS in production

### Actual Issues to Fix
- JavaScript runtime errors in console
- Broken internal links
- Missing local assets (images, icons)
- CSS layout issues
- Content not loading from JSON
- **Manifest icon path errors** - Ensure `assets/manifest.json` uses relative paths (`icons/` not `assets/icons/`)

## Important Notes

- **No build tools required** - This is intentional, keep it simple
- **Content is dynamic** - Loaded from `content/content.json` via JavaScript
- **PWA features included** - Service worker, manifest, icons configured
- **External dependencies** - Font Awesome and Google Fonts (CDN)
- **Mobile-first design** - Responsive layout with mobile optimizations
- **SEO considerations** - Static HTML with meta tags configured

## Common Tasks

### Update Social Links
Edit `content/content.json` → groups[0].sections[0].items array

### Add New Technology
Edit `content/content.json` → groups[0].sections[2].items array

### Change Color Scheme  
Edit `assets/styles.css` → modify RGBA values in CSS rules

### Update Profile Description
Edit `content/content.json` → groups[0].sections[1].description

**Always test changes locally before pushing to production.****