# 3dime - Social Hub Website
3dime is a minimalistic PHP-based social hub website that allows users to display their profiles, links, and information in one centralized location. The site features a responsive design, API integrations, and progressive web app (PWA) functionality.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites and Setup
- **PHP 7.4 or higher** is required (check with `php --version`)
- **Verify PHP installation**: `php --version` - should return PHP 7.4+ 
- **No additional dependencies** - this is a vanilla PHP/HTML/CSS/JS project with no package managers

### Bootstrap and Development
- **Clone and enter repository**:
  ```bash
  git clone https://github.com/m-idriss/3dime.git
  cd 3dime
  ```

- **Start development server**:
  ```bash
  php -S localhost:8000
  ```
  - Server starts **immediately** (< 1 second startup time)
  - Access main site: http://localhost:8000
  - Access API proxy: http://localhost:8000/proxy.php

### Development Server Commands
- **Start server**: `php -S localhost:8000` 
- **Stop server**: `Ctrl+C` or kill the process
- **Test server**: `curl http://localhost:8000/` should return HTTP 200

## Validation and Testing

### Manual Validation Requirements
**CRITICAL**: After making any changes, ALWAYS manually validate functionality:

1. **Start development server** and verify it responds:
   ```bash
   php -S localhost:8000
   curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/
   ```
   Expected: HTTP 200 response

2. **Test API endpoints**:
   ```bash
   # GitHub API proxy (should work)
   curl "http://localhost:8000/proxy.php?service=github"
   # Expected: {"repos":N} where N is number of public repos
   
   # Trakt API proxy (should fail without config.php)
   curl "http://localhost:8000/proxy.php?service=trakt"
   # Expected: {"error":"Configuration file not found"}
   ```

3. **Test static assets**:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/assets/content.json
   curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/assets/styles.css
   curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/assets/script.js
   ```
   Expected: All return HTTP 200

4. **Validate PHP syntax**:
   ```bash
   php -l proxy.php
   php -l index.html  # Will pass - PHP doesn't parse HTML content
   ```
   Expected: "No syntax errors detected"

### Complete User Scenario Testing
**ALWAYS test these scenarios after changes**:

1. **Load the website** in a browser or with Playwright
2. **Verify all sections load** from content.json (Profile, About Me, Tech Stack, etc.)
3. **Test logo click** - should reload the page
4. **Verify animations** - cards should appear with staggered animation
5. **Test responsive design** - check mobile and desktop layouts
6. **Verify external links** open correctly (GitHub, LinkedIn, etc.)

## File Structure and Key Components

### Repository Structure
```
/
├── .github/
│   └── workflows/          # GitHub Actions (deployment, screenshots)
├── assets/
│   ├── content.json        # Site content configuration
│   ├── script.js          # Main JavaScript functionality  
│   ├── styles.css         # CSS styling
│   ├── sw.js              # Service worker for PWA
│   ├── manifest.json      # PWA manifest
│   ├── icons/             # PWA icons
│   └── screenshots/       # Auto-generated screenshots
├── index.html             # Main entry point
├── proxy.php              # API proxy for GitHub/Trakt
├── favicon.ico
└── README.md
```

### Critical Files
- **`index.html`** - Main HTML entry point, loads all assets
- **`proxy.php`** - Handles API calls to GitHub and Trakt APIs
- **`assets/content.json`** - **MOST IMPORTANT**: Contains all site content, links, and configuration
- **`assets/script.js`** - JavaScript for animations, API calls, and PWA functionality
- **`assets/styles.css`** - All styling including responsive design and animations

## Content Management

### Updating Site Content
- **Edit `assets/content.json`** to modify:
  - Profile information and links
  - Social media links
  - Technology stack items
  - Experience and education entries
  - Hobbies and interests
  - Contact information

### Adding New Sections
- Modify `assets/content.json` following the existing structure
- Sections support: title, description, logo, items with various link types
- Item types: social icons, technology chips, standard links

## API Integration

### GitHub API Proxy
- **Endpoint**: `proxy.php?service=github`
- **Purpose**: Fetches public repository count for user 'm-idriss'
- **No configuration required** - hardcoded username
- **Usage in frontend**: Updates badge on GitHub icon

### Trakt API Proxy (Optional)
- **Endpoint**: `proxy.php?service=trakt`
- **Purpose**: Fetches movie watch count from Trakt
- **Requires**: `config.php` file with `TRAKT_CLIENT_ID` constant
- **Without config**: Returns proper error message
- **Create config template**:
  ```php
  <?php
  define('TRAKT_CLIENT_ID', 'your_api_key_here');
  ?>
  ```

## Deployment and CI/CD

### GitHub Actions Workflows
1. **FTP Deployment** (`.github/workflows/deploy-on-ftp.yml`)
   - Triggers on push to `master` branch
   - Deploys via FTP using repository secrets
   - Required secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_PATH`

2. **Screenshot Updates** (`.github/workflows/update-screenshot.yml`)
   - Runs daily at 6 AM UTC or manually
   - Takes screenshots of live site (https://3dime.com)
   - Auto-commits updated screenshots to repository

### Pre-commit Validation
- **Always validate PHP syntax**: `php -l proxy.php`
- **Test local functionality** using the validation commands above
- **No linting tools** - this is a simple vanilla project

## Common Development Tasks

### Making Content Changes
1. Edit `assets/content.json`
2. Start development server: `php -S localhost:8000`
3. Test in browser: http://localhost:8000
4. Verify content appears correctly
5. Test animations and interactions

### Modifying Styling
1. Edit `assets/styles.css`
2. Refresh browser to see changes
3. Test responsive design (mobile/desktop)
4. Verify animations and transitions

### JavaScript Changes
1. Edit `assets/script.js`
2. Clear browser cache and refresh
3. Check browser console for errors
4. Test PWA functionality (service worker)

### Adding New Features
1. **Always start with content.json** if adding new sections
2. **Update CSS** for styling new elements
3. **Modify JavaScript** if adding new interactions
4. **Test extensively** using validation scenarios

## Troubleshooting

### Common Issues
- **Server won't start**: Check PHP installation and port 8000 availability
- **404 errors**: Ensure you're in the project root directory
- **API proxy fails**: Check network connectivity; GitHub API has rate limits
- **Content not loading**: Verify content.json syntax with online JSON validator
- **Styling broken**: Check CSS syntax and browser developer tools
- **PWA not working**: Clear browser cache, check service worker in dev tools

### Debug Commands
```bash
# Check PHP version and availability
php --version

# Test PHP syntax
php -l proxy.php

# Test JSON validity
curl -s http://localhost:8000/assets/content.json | python -m json.tool

# Check server accessibility
curl -I http://localhost:8000/

# View server logs (run server in foreground)
php -S localhost:8000
```

## Expected Timing
- **Server startup**: < 1 second
- **Page load**: < 2 seconds (depending on external APIs)
- **API proxy responses**: 1-3 seconds (depends on external APIs)
- **Asset loading**: < 1 second for static files

## Security Notes
- **config.php is gitignored** - contains sensitive API credentials
- **Never commit API keys** to the repository
- **Proxy.php handles CORS** for external API calls
- **No user input validation** required - static content site