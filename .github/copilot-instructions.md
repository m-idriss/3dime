# 3dime - Personal Social Hub Website

3dime is a minimalistic static website serving as a personal social hub to regroup and share profiles & links in one place. It's built with vanilla HTML5, CSS3, and JavaScript with Progressive Web App (PWA) features.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Run the Application
**NO BUILD PROCESS REQUIRED** - This is a static website with no dependencies to install.

- **Start local development server:**
  ```bash
  cd /home/runner/work/3dime/3dime
  python3 -m http.server 8000
  ```
  - Server starts immediately (<1 second)
  - Access at `http://localhost:8000`
  - **NEVER CANCEL** - Server runs continuously until stopped

- **Test the website:**
  - Open `http://localhost:8000` in browser  
  - Website loads in <2 seconds locally
  - All links and interactions should work
  - Logo click reloads the page (expected behavior)

### No Build, Test, or Lint Commands
- **There is NO package.json, npm, webpack, or build tools**
- **There are NO automated tests**
- **There are NO linting tools configured**
- This is a static website - files are served directly

## Validation

### Manual Validation Requirements
**ALWAYS perform these validation steps after making ANY changes:**

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

3. **Test responsive design:**
   - Resize browser window to mobile viewport (375x667)
   - Verify layout adapts correctly
   - Test navigation on mobile view

4. **Check browser console:**
   - Expected errors when running locally:
     - `Failed to load resource: net::ERR_BLOCKED_BY_CLIENT` (Font Awesome, Google Fonts)
     - `Error fetching GitHub data: TypeError: Failed to fetch` (GitHub API)
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
├── index.html              # Main entry point
├── assets/
│   ├── styles.css          # Main stylesheet
│   ├── script.js           # Main JavaScript functionality
│   ├── sw.js              # Service worker for PWA
│   ├── manifest.json      # PWA manifest
│   ├── background.jpg     # Background image
│   ├── logo.png           # Site logo
│   └── icons/             # PWA icons (16, 192, 512px)
├── content/
│   └── content.json        # Dynamic content configuration
├── .github/
│   └── workflows/
│       ├── deploy-on-ftp.yml      # Auto-deployment
│       └── update-screenshot.yml  # Screenshot generation
└── favicon.ico            # Site favicon
```

### Content Management
- **Edit content**: Modify `content/content.json` to update:
  - Profile information and social links
  - Technology stack items
  - Experience and project links
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