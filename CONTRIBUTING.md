# Contributing to 3dime

Thank you for your interest in contributing to **3dime**! This document provides guidelines and information to help you contribute effectively to this personal social hub website.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Repository Structure](#repository-structure)
- [Making Changes](#making-changes)
- [Code Standards](#code-standards)
- [Testing Your Changes](#testing-your-changes)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Resources](#resources)

## 🤝 Code of Conduct

This project adheres to the Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to contact@3dime.com.

**Key principles:**
- **Be respectful and constructive** in all interactions
- **Welcome newcomers** and help them get started
- **Share knowledge generously** and celebrate others' contributions
- **Focus on what's best** for the community

For detailed guidelines, enforcement procedures, and reporting information, please read our full [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

### Prerequisites

- **Web browser** (Chrome, Firefox, Safari, or Edge)
- **Python 3** (for local development server)
- **Git** (for version control)
- **Text editor/IDE** (VS Code, Sublime Text, etc.)

### Quick Start

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/3dime.git
   cd 3dime
   ```
3. **Start the development server**:
   ```bash
   python3 -m http.server 8000
   ```
4. **Open your browser** to `http://localhost:8000`

## 🏗️ Development Environment

### No Build Process Required

3dime is a **static website** with no build tools or dependencies. Files are served directly by the web server.

### Starting Development Server

```bash
# Navigate to project directory
cd /path/to/3dime

# Start local server (Python 3)
python3 -m http.server 8000

# Alternative with Node.js (if you have it)
npx http-server -p 8000

# Alternative with PHP (if you have it)
php -S localhost:8000
```

The website will be available at `http://localhost:8000`.

### Expected Behavior

- **Server starts**: Immediately (<1 second)
- **Page loads**: <2 seconds locally
- **All functionality**: Links, animations, and interactions should work
- **Logo click**: Reloads the page (expected behavior)

## 📁 Repository Structure

```
3dime/
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
│   └── workflows/         # GitHub Actions (deployment, screenshots)
├── favicon.ico            # Site favicon
├── LICENSE                # MIT License
└── README.md              # Project documentation
```

### Key Files Explained

- **`content/content.json`**: Contains all dynamic content (profile, experience, etc.)
- **`assets/styles.css`**: All styling rules and responsive design
- **`assets/script.js`**: JavaScript functionality and animations
- **`assets/manifest.json`**: Progressive Web App configuration
- **`assets/sw.js`**: Service worker for offline functionality

## 🔄 Making Changes

### Types of Contributions

1. **Content Updates**: Edit `content/content.json`
2. **Styling Changes**: Edit `assets/styles.css`
3. **Functionality**: Edit `assets/script.js`
4. **PWA Features**: Edit `assets/manifest.json`
5. **Documentation**: Edit README.md or other docs

### Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** (see sections below)

3. **Test thoroughly** (see Testing section)

4. **Commit your changes** (using Gitmoji format):
   ```bash
   git add .
   git commit -m "✨ [feature/awesome] add your descriptive commit message"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 📏 Code Standards

### HTML

- Use **semantic HTML5** elements
- Include proper **ARIA labels** for accessibility
- Maintain **clean indentation** (2 spaces)
- Keep the structure **minimal and clean**

### CSS

- Follow the existing **naming conventions**
- Use **CSS custom properties** (variables) when possible
- Maintain **mobile-first** responsive design
- Keep **glassmorphism** design consistency
- Group related styles together

### JavaScript

- Use **modern ES6+** syntax
- Follow **camelCase** naming convention
- Add **error handling** for API calls
- Keep functions **small and focused**
- Comment complex logic

### JSON (Content)

- Maintain proper **JSON structure**
- Use **descriptive property names**
- Keep **consistent data types**
- Validate JSON syntax before committing

### General Guidelines

- **Keep changes minimal** and focused
- **Don't break existing functionality**
- **Test on multiple browsers** when possible
- **Follow existing patterns** in the codebase

## 🧪 Testing Your Changes

### Manual Validation (Required)

After making any changes, **always** perform these steps:

1. **Start local server**:
   ```bash
   python3 -m http.server 8000
   ```

2. **Load and test the website**:
   - Navigate to `http://localhost:8000`
   - Verify page loads completely with all content sections
   - Test social media links in the profile section
   - Click on technology chips (Java, JavaScript, etc.)
   - Test company/project links in experience section
   - Click contact email link
   - **Test logo click** - should reload the page

3. **Test responsive design**:
   - Resize browser window to mobile viewport (375x667)
   - Verify layout adapts correctly
   - Test navigation on mobile view

4. **Check browser console**:
   - Open Developer Tools (F12)
   - Look for JavaScript errors (red messages)
   - **Expected warnings** when running locally:
     - Font Awesome CDN blocked
     - Google Fonts CDN blocked
     - GitHub API fails (external API blocked)
   - **Expected success**: "SW registered" (Service Worker)

### Complete User Scenarios

Test these workflows after making changes:

1. **Profile interaction flow**:
   Load homepage → View profile section → Click GitHub link → Verify opens in new tab

2. **Content browsing flow**:
   Load homepage → Scroll through all sections → Click various technology links → Verify external navigation

3. **Contact flow**:
   Load homepage → Scroll to contact section → Click email link → Verify mailto opens

4. **Mobile experience flow**:
   Resize to mobile → Test all interactions → Verify responsive layout

### No Automated Tests

This project currently has **no automated testing framework**. All testing is manual validation.

## 📤 Submitting Changes

### Pull Request Guidelines

1. **Use descriptive titles with Gitmoji** (helps GitHub Copilot provide better suggestions):
   - ✅ "✨ Add dark mode toggle functionality"
   - ✅ "🐛 Fix mobile navigation responsiveness"
   - ✅ "📚 Update installation instructions"
   - ❌ "Update CSS"
   - ❌ "Fix bug"

2. **Provide detailed descriptions**:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots for UI changes

3. **Keep PRs focused**:
   - One feature or fix per PR
   - Avoid mixing unrelated changes

4. **Test thoroughly**:
   - Complete all manual validation steps
   - Test on multiple browsers if possible
   - Include screenshots of changes

### Pull Request Title Format

**Use Gitmoji in PR titles** to help GitHub Copilot provide better suggestions and improve consistency:

```
🎯 Brief description of the change (50 chars or less)
```

**Examples:**
- `✨ Add GitHub stars badge to profile section`
- `🐛 Fix mobile navigation responsiveness issue`
- `📚 Update installation instructions in README`
- `💄 Improve glassmorphism effects in hero section`
- `🔧 Update PWA manifest configuration`

**Why this helps:**
- GitHub Copilot better understands the nature of your changes
- Provides more accurate suggestions and auto-completions
- Maintains consistency with our commit message format
- Improves project readability and navigation

### Commit Message Format

We encourage **Gitmoji-style commit messages and PR titles** to improve readability and help GitHub Copilot suggest better messages that follow our project conventions.

```
🎯 [type/scope] brief description (50 chars or less)

Detailed explanation if needed (wrap at 72 chars)
- Bullet points for multiple changes
- Include reasoning for complex changes
```

#### Gitmoji Types

| Gitmoji | Type | Description | Example |
|---------|------|-------------|---------|
| ✨ | `feature` | New functionality | `✨ [feature/profile] add GitHub stars badge to profile section` |
| 🐛 | `bugfix` | Bug fixes | `🐛 [bugfix/mobile] fix mobile navigation responsiveness` |
| 📚 | `docs` | Documentation | `📚 [docs/readme] update installation instructions` |
| 💄 | `style` | Styling/UI changes | `💄 [style/css] update glassmorphism effects` |
| ♻️ | `refactor` | Code refactoring | `♻️ [refactor/js] optimize content loading function` |
| 📝 | `content` | Content updates | `📝 [content/experience] update experience section with new role` |
| 🔧 | `config` | Configuration | `🔧 [config/pwa] update manifest.json` |
| 👷 | `ci` | CI/CD changes | `👷 [ci/actions] add code quality checks` |

#### Additional Gitmoji Options

- 🎨 `:art:` - Improve structure/format
- ⚡ `:zap:` - Improve performance
- 🔒 `:lock:` - Fix security issues
- 🚀 `:rocket:` - Deploy stuff
- 📱 `:iphone:` - Work on responsive design

#### Examples

**Good commit messages:**
- `✨ [feature/badges] add GitHub stars badge to profile section`
- `🐛 [bugfix/mobile] correct mobile navigation responsiveness`
- `📚 [docs/contributing] update installation instructions`
- `📝 [content/profile] update experience section with new role`
- `💄 [style/animations] improve page transitions`
- `👷 [ci/deploy] add automated deployment workflow`

#### Resources

- **[Gitmoji Guide](https://gitmoji.dev/)**: Complete list of commit emojis
- **[Conventional Commits](https://www.conventionalcommits.org/)**: Additional formatting guidance

## 🐛 Reporting Issues

### Before Creating an Issue

1. **Check existing issues** for duplicates
2. **Test with the latest version** of the repository
3. **Reproduce the issue** with steps

### Issue Template

When creating an issue, include:

```markdown
**Description**
Brief description of the issue

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error...

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Browser: [Chrome 91, Firefox 89, etc.]
- Device: [Desktop, Mobile, etc.]
- OS: [Windows 10, macOS, etc.]

**Screenshots**
If applicable, add screenshots
```

### Types of Issues

- **🐛 Bug reports**: Something is broken
- **✨ Feature requests**: New functionality
- **📚 Documentation**: Improvements to docs
- **🎨 Design**: UI/UX improvements
- **⚡ Performance**: Speed or optimization issues

## 📚 Resources

### Project-Specific

- **[README.md](README.md)**: Project overview and setup
- **[SITE_REVIEW_RECOMMENDATIONS.md](docs/SITE_REVIEW_RECOMMENDATIONS.md)**: Detailed code review and improvement suggestions
- **[GitHub Actions Workflows](.github/workflows/)**: Automated deployment and screenshot generation

### External Documentation

- **[MDN Web Docs](https://developer.mozilla.org/)**: HTML, CSS, JavaScript reference
- **[Progressive Web Apps](https://web.dev/progressive-web-apps/)**: PWA best practices
- **[Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)**: WCAG 2.1 guidelines

### Tools

- **[VS Code](https://code.visualstudio.com/)**: Recommended editor with extensions:
  - Live Server
  - Prettier
  - ESLint
  - HTML CSS Support

### Development Tips

1. **Use browser dev tools** for debugging CSS and JavaScript
2. **Test responsive design** with device simulation
3. **Validate HTML** with [W3C Validator](https://validator.w3.org/)
4. **Check accessibility** with browser accessibility tools
5. **Test PWA features** with Lighthouse in Chrome DevTools

## ❓ Questions?

If you have questions that aren't covered in this guide:

1. **Check existing [GitHub Issues](https://github.com/m-idriss/3dime/issues)**
2. **Review the [README.md](README.md)**
3. **Create a new issue** with the `question` label

Thank you for contributing to 3dime! 🎉