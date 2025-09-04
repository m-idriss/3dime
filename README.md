<div align="center">

# 🌟 3dime

<img src="assets/logo.png" alt="3dime Logo" width="120" height="120"/>

### ✨ Modern Personal Social Hub ✨

*A minimalistic, beautiful platform to showcase your digital presence in one elegant place*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-3dime.com-00D4AA?style=for-the-badge)](https://3dime.com)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-9C27B0?style=for-the-badge)](assets/manifest.json)
[![Responsive Design](https://img.shields.io/badge/Design-Responsive-FF6B6B?style=for-the-badge)](#features)

---

</div>

## 🎯 Overview

3dime is a sophisticated personal social hub that transforms how you share your digital identity. Built with modern web technologies and featuring stunning glass-morphism design, it creates an elegant gateway to all your profiles, projects, and professional information.

**Architecture**: Hybrid static frontend with optional PHP backend services for enhanced API functionality. Works perfectly as a static website, with optional PHP services for real-time data like GitHub activity heatmaps and social media metrics.

Perfect for developers, designers, content creators, and professionals who want a beautiful, fast-loading landing page that showcases their work and connects visitors to their various online presence.

## ✨ Features

### 🎨 **Modern Design**
- **Glass-morphism UI** - Stunning frosted glass effects with smooth animations
- **Responsive Layout** - Flawless experience across all devices and screen sizes
- **Dark Theme** - Professional dark aesthetic with perfect contrast ratios
- **Smooth Animations** - Subtle micro-interactions and staggered content loading

### ⚡ **Performance & Technology**
- **Hybrid Architecture** - Static frontend with optional PHP backend services
- **Progressive Web App (PWA)** - Installable, works offline, app-like experience
- **Pure Frontend Core** - Essential features work with pure HTML5, CSS3, and Vanilla JavaScript ES6+ modules
- **Enhanced API Features** - Optional PHP services for real-time GitHub activity, social metrics, and external API integration
- **Service Worker** - Intelligent caching for lightning-fast repeat visits
- **Optimized Assets** - Compressed images and efficient resource loading
- **Modular Architecture** - Clean separation of concerns with ES6 modules

### 🔗 **Content Management**
- **JSON-LD Structured Data** - Easy customization through standards-compliant structured data
- **Dynamic Loading** - Content fetched asynchronously for better performance
- **Social Integration** - Showcase all your profiles with custom badges
- **Portfolio Sections** - Highlight your experience, education, and projects

### 🛡️ **Modern Web Standards**
- **Semantic HTML5** - Accessible markup with proper ARIA labels
- **CSS Custom Properties** - Maintainable styling with CSS variables
- **Mobile-First Design** - Optimized for mobile devices first
- **SEO Optimized** - Proper meta tags and structured content

## 🛠️ Technology Stack

<table>
<tr>
<td align="center">

**Frontend (Core)**
- HTML5
- CSS3 (Custom Properties)
- Vanilla JavaScript (ES6+ Modules)
- Font Awesome Icons
- Google Fonts (Inter)

</td>
<td align="center">

**Backend (Optional)**
- PHP 7.4+ for API services
- GitHub API integration
- Twitter/X API integration
- Trakt TV API integration
- CORS-friendly proxy services

</td>
<td align="center">

**PWA Features**
- Service Worker
- Web App Manifest
- Offline Support
- Install Prompts
- App Icons

</td>
</tr>
<tr>
<td align="center">

**Deployment Options**
- Static hosting (basic mode)
- PHP hosting (enhanced mode)
- GitHub Actions
- FTP Deploy

</td>
<td align="center">

**Enhanced Features**
- GitHub activity heatmap
- Real-time social metrics
- API rate limit management
- Graceful fallbacks

</td>
<td align="center">

**Standards**
- Progressive Enhancement
- Mobile-First Design
- Accessibility (WCAG AA)
- SEO Optimized

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites

**Basic Mode (Static)**:
- Any modern web server (Python, Node.js, Nginx, Apache)
- No dependencies required!

**Enhanced Mode (with PHP features)**:
- PHP 7.4+ web server
- curl extension enabled
- Optional: API keys for external services

### Installation

```bash
# Clone the repository
git clone https://github.com/m-idriss/3dime.git
cd 3dime

# Choose your deployment mode:

# OPTION 1: Basic Static Mode (core features only)
python3 -m http.server 8000        # Python
# OR npx serve .                   # Node.js

# OPTION 2: Enhanced Mode with PHP (all features)
php -S localhost:8000              # PHP built-in server
# OR configure with Apache/Nginx + PHP-FPM

# Open in browser
open http://localhost:8000
```

### ⚙️ Configuration

**Basic Static Mode**: Works immediately with all core features including PWA functionality.

**Enhanced Mode Setup**:
1. **Copy configuration**: `cp config/config.php.example config/config.php`
2. **Edit config.php** with your API credentials (optional):
   ```php
   <?php
   // GitHub API (recommended for heatmap and metrics)
   define('GITHUB_TOKEN', 'your_github_token_here');
   define('GITHUB_USERNAME', 'your-username');
   define('GITHUB_REPO', 'your-repo-name');
   
   // Optional: Social APIs
   define('TRAKT_CLIENT_ID', 'your_trakt_key');
   define('X_BEARER_TOKEN', 'your_twitter_token');
   define('X_USERNAME', 'your_twitter_handle');
   ?>
   ```

The project uses modern standards-based configuration:

1. **Content Configuration**: Edit `structured-data.jsonld` with your personal information using JSON-LD schema.org format
2. **Styling Configuration**: Customize appearance in `assets/styles-enhanced.css`
3. **PWA Configuration**: Update `assets/manifest.json` for Progressive Web App settings

## 🏗️ Architecture Philosophy

3dime embraces a **progressive enhancement** approach with a hybrid architecture:

### Core Principle: Static-First
- **Base functionality** works with pure static files
- **No build process** required for core features
- **Zero dependencies** for basic deployment
- **Progressive enhancement** adds advanced features when server capabilities allow

### Why Hybrid Architecture?

1. **Maximum Compatibility**: Works on any hosting platform, from basic static hosts to full PHP servers
2. **Performance**: Static assets load instantly, PHP services enhance without blocking
3. **Reliability**: Site remains functional even if PHP services are unavailable
4. **User Choice**: Developers can choose their preferred deployment complexity
5. **Future-Proof**: Easy to migrate between hosting types as needs change

### Implementation Details

- **Frontend**: Pure ES6+ modules, no transpilation needed
- **Backend**: Optional PHP services with graceful fallbacks
- **API Integration**: Proxy pattern for CORS handling and rate limit management
- **Data Loading**: Asynchronous with error handling and user-friendly fallbacks

This architecture ensures 3dime delivers value regardless of hosting constraints while providing enhanced experiences when advanced features are available.

## 🎨 Customization

1. **Edit your content** in `structured-data.jsonld`:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Name",
  "description": "Your professional description here",
  "url": "https://yourwebsite.com",
  "email": "contact@yourwebsite.com",
  "sameAs": [
    "https://github.com/yourusername",
    "https://www.linkedin.com/in/yourprofile/",
    "https://x.com/yourusername"
  ],
  "jobTitle": "Your Job Title",
  "knowsAbout": ["JavaScript", "Java", "React"]
}
```

2. **Update colors** in `assets/styles-enhanced.css` using CSS custom properties
3. **Replace logo** with your own in `assets/logo.png`
4. **Modify PWA settings** in `assets/manifest.json`

## 🌐 Deployment

### Deployment Modes

3dime supports two deployment modes to fit different hosting environments:

#### 🟢 **Static Mode (Basic)**
- **Hosting**: Any static host (Netlify, Vercel, GitHub Pages, S3, etc.)
- **Features**: All core features, PWA functionality, responsive design
- **Requirements**: None - just upload files
- **Limitations**: No real-time GitHub heatmap or social metrics

#### 🟡 **Enhanced Mode (PHP)**
- **Hosting**: PHP-enabled servers (shared hosting, VPS, dedicated servers)
- **Features**: All static features PLUS real-time GitHub activity heatmap, social metrics
- **Requirements**: PHP 7.4+, curl extension
- **Benefits**: Live data updates, API rate limit management, enhanced user experience

### Automatic Deployment (Recommended)

3dime includes **zero-config automatic deployment** via GitHub Actions:

1. **Fork this repository**
2. **Choose your hosting type** and add appropriate secrets:

   **For PHP hosting** (Enhanced Mode):
   ```
   FTP_SERVER     → your-php-server.com
   FTP_USERNAME   → your-ftp-username  
   FTP_PASSWORD   → your-ftp-password
   FTP_PATH       → /public_html/ (or your web root)
   ```

   **For static hosting** (Basic Mode):
   - Configure your preferred static host (Netlify, Vercel, etc.)
   - Or use the FTP deployment for static file hosting

3. **Push to main branch** - Your site deploys automatically! 🎉

### Automated Quality Assurance

3dime includes **automated workflows** via GitHub Actions:

- **📸 Screenshot Updates**: Automatically captures and updates website screenshots daily
- **🚀 Auto-deployment**: Deploys changes to production when pushed to master branch

All workflows run automatically - no configuration needed!

### Manual Deployment

**Static Mode**: Upload all files except `/config/` and `/services/` directories to any web server:
- **Static hosts**: Netlify, Vercel, GitHub Pages
- **Traditional hosting**: Any web server with static file support
- **Cloud platforms**: AWS S3, Google Cloud Storage, Azure Static Web Apps

**Enhanced Mode**: Upload all files to a PHP-enabled server:
- **Shared hosting**: Most cPanel-based hosting providers
- **VPS/Dedicated**: Configure with Apache/Nginx + PHP-FPM
- **Cloud platforms**: AWS EC2, DigitalOcean, Google Cloud Compute

### Feature Comparison

| Feature | Static Mode | Enhanced Mode |
|---------|-------------|---------------|
| Core website functionality | ✅ | ✅ |
| PWA features | ✅ | ✅ |
| Responsive design | ✅ | ✅ |
| GitHub activity heatmap | ❌ | ✅ |
| Real-time social metrics | ❌ | ✅ |
| API rate limit management | ❌ | ✅ |
| External API integration | ❌ | ✅ |
| Graceful fallbacks | ✅ | ✅ |

## 📸 Screenshots

<div align="center">

### 🖥️ Desktop Experience
![Desktop Screenshot](assets/screenshots/desktopPage1920x1080.jpeg)

### 📱 Mobile Experience  
![Mobile Screenshot](assets/screenshots/iPhone_13_Pro_Max.jpeg)

*Screenshots are automatically updated daily via GitHub Actions*

</div>

## 🎯 Use Cases

- **Developers** - Showcase your GitHub projects and tech stack
- **Designers** - Present your portfolio and design tools
- **Content Creators** - Link to all your social platforms
- **Professionals** - Create a digital business card
- **Students** - Display your learning journey and projects
- **Freelancers** - Professional landing page for clients

## 🔧 Advanced Configuration

### Custom Styling
```css
/* Edit assets/styles-enhanced.css */
:root {
  --glass-bg: rgba(255, 255, 255, 0.15);
  --accent-color: #3b82f6;
  --text-primary: #fff;
}
```

### PWA Customization
```json
// Edit assets/manifest.json
{
  "name": "Your Name",
  "short_name": "YourName", 
  "theme_color": "#000000",
  "background_color": "#000000"
}
```

### Content Sections
The `structured-data.jsonld` supports standard JSON-LD schema.org formats for:
- **Person** with social links and professional information
- **Organization** for work history and affiliations  
- **Educational** credentials and courses
- **Skills** and technical expertise
- **Contact** information and social profiles

## 📋 Documentation & Roadmap

3dime includes comprehensive project documentation and development planning:

### 🔍 Website Audit & Analysis
A complete technical, UX, and performance audit has been conducted with detailed findings and recommendations:

📊 **[Website Audit Report](docs/WEBSITE_AUDIT_REPORT.md)** - Comprehensive analysis covering:
- Technical performance, SEO, and mobile responsiveness ✅
- UX and navigation flow assessment ✅
- Functional bug identification and documentation ✅
- Feature proposals and enhancement opportunities ✅

### 🗺️ Development Roadmap  
Based on the audit findings, 3dime follows a structured development roadmap focusing on security, performance, and user experience:

- **Phase 1**: Security & Accessibility (Critical fixes, WCAG compliance)
- **Phase 2**: Performance & SEO (Lighthouse optimization, enhanced metadata)  
- **Phase 3**: Modern Features & UX (Advanced theming, micro-interactions)
- **Phase 4**: Innovation & Future (Advanced integrations, scalability)

📋 **[View Complete Roadmap](docs/ROADMAP.md)** - Detailed timeline, priorities, and implementation guidelines

### 📚 Additional Documentation
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Comprehensive technical documentation
- **[Security Policy](docs/SECURITY.md)** - Security guidelines and vulnerability reporting  
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the project
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community guidelines

## 🤝 Contributing

1. **Review the [Audit Report](docs/WEBSITE_AUDIT_REPORT.md)** to understand current website status and identified opportunities
2. **Check the [Roadmap](docs/ROADMAP.md)** to see current priorities and find tasks that match your skills
3. **Fork** the repository
4. **Create** a feature branch: `git checkout -b feature/amazing-feature`
5. **Commit** your changes: `git commit -m '✨ [feature/amazing] add amazing feature'`
6. **Push** to the branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

See our [contribution guidelines](CONTRIBUTING.md), [audit report](docs/WEBSITE_AUDIT_REPORT.md), and [development roadmap](docs/ROADMAP.md) for complete details.

## 📊 Performance

- ⚡ **Load Time**: < 2 seconds on 3G
- 📱 **Mobile Optimized**: 100/100 Lighthouse Mobile Score
- 🎯 **SEO Ready**: Semantic HTML with meta tags
- ♿ **Accessible**: ARIA labels and keyboard navigation
- 🔧 **PWA Score**: 100/100 Progressive Web App

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Idriss** - [GitHub](https://github.com/m-idriss) • [LinkedIn](https://www.linkedin.com/in/i-mohamady/) • [Website](https://3dime.com)

---

<div align="center">

**Made with ❤️ using modern web standards**

*Hybrid static frontend with optional PHP backend services*

[![Star this repo](https://img.shields.io/github/stars/m-idriss/3dime?style=social)](https://github.com/m-idriss/3dime)

</div>