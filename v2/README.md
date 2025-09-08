# 3dime v2 - Angular Application

This directory contains the next-generation Angular application for the 3dime personal social hub.

## Overview

**3dime v2** is a modern Angular application that will eventually replace the current static website. It's being developed in parallel to ensure a smooth transition and maintain all existing functionality while adding modern framework benefits.

## Architecture

- **Framework**: Angular v20+ with standalone APIs
- **Rendering**: Server-Side Rendering (SSR) with Angular Universal
- **Styling**: SCSS with custom design tokens
- **Code Quality**: ESLint + Prettier + Husky pre-commit hooks
- **Design**: Glass-morphism dark theme with no rounded corners
- **Deployment**: `/v2/` path (parallel to existing site at `/`)

## Project Structure

```
v2/
├── src/
│   ├── app/                    # Angular application
│   ├── styles/                 # Design system
│   │   ├── _design-tokens.scss # CSS custom properties
│   │   ├── _mixins.scss        # SCSS mixins and utilities
│   │   └── _animations.scss    # Keyframe animations
│   ├── styles.scss             # Main stylesheet
│   ├── index.html              # App shell
│   └── main.ts                 # Application bootstrap
├── public/                     # Static assets
├── dist/                       # Build output (ignored by git)
├── angular.json                # Angular CLI configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── eslint.config.js            # ESLint configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 20+

### Installation

```bash
# Navigate to v2 directory
cd v2

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200/`

## Available Scripts

### Development

```bash
npm start              # Start development server (http://localhost:4200)
npm run watch          # Build and watch for changes
```

### Building

```bash
npm run build          # Production build
npm run build:v2       # Production build with /v2/ base href
```

### Code Quality

```bash
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues automatically
npm run format         # Format code with Prettier
npm run format:check   # Check if code is formatted
```

### Testing

```bash
npm test               # Run unit tests
```

### SSR (Server-Side Rendering)

```bash
npm run serve:ssr:v2   # Serve SSR build locally
```

## Design System

### Design Tokens

The application uses a comprehensive design token system defined in `src/styles/_design-tokens.scss`:

- **Colors**: Dark theme palette with primary accent color
- **Typography**: Responsive font scale with system fonts
- **Spacing**: 4px-based spacing scale
- **Shadows**: Glass-morphism shadow system
- **Border Radius**: Set to 0 (no rounded corners)
- **Breakpoints**: Mobile-first responsive breakpoints

### SCSS Mixins

Utility mixins in `src/styles/_mixins.scss`:

- **Glass Effects**: `@include mixins.glass-card()`
- **Responsive**: `@include mixins.respond-to(breakpoint)`
- **Typography**: `@include mixins.heading(size)`
- **Layout**: `@include mixins.flex-center()`
- **Buttons**: `@include mixins.button-primary()`

### Usage Example

```scss
.my-component {
  @include mixins.glass-card('lg');
  @include mixins.respond-to(md) {
    @include mixins.heading('2xl');
  }
}
```

## Development Guidelines

### Code Style

- TypeScript strict mode enabled
- ESLint with Angular recommended rules
- Prettier for consistent formatting
- Pre-commit hooks ensure code quality

### Component Architecture

- Standalone components (no NgModules)
- Reactive programming with RxJS
- OnPush change detection strategy
- Accessibility-first development

### Naming Conventions

- **Components**: PascalCase (e.g., `HeroComponent`)
- **Files**: kebab-case (e.g., `hero.component.ts`)
- **CSS Classes**: kebab-case with BEM methodology
- **Variables**: camelCase

## Migration Progress

### ✅ Completed (Milestone 1)

- [x] Angular v20+ project setup with SSR
- [x] Code quality tools (ESLint, Prettier)
- [x] Design token system
- [x] SCSS architecture with mixins
- [x] Build configuration for `/v2/` deployment

### ✅ Completed (Milestone 2)

- [x] Application routing setup
  - [x] Route structure for `/v2/`, `/v2/services`, `/v2/projects`, `/v2/about`, `/v2/contact`
  - [x] Lazy loading for all routes
  - [x] Proper page titles and meta tags per route
- [x] Shared layout components
  - [x] `LayoutShellComponent` - Main application wrapper
  - [x] `HeaderComponent` with navigation and logo
  - [x] `FooterComponent` with social links
  - [x] `NavigationComponent` with mobile responsiveness
  - [x] `SkipLinksComponent` for accessibility
- [x] Base responsive framework
  - [x] Mobile-first responsive design
  - [x] Glass-morphism effects as reusable SCSS mixins
  - [x] Responsive navigation with hamburger menu

### 🚧 In Progress (Milestone 3)

### 📋 Planned (Milestones 3-7)

- [ ] Content migration from structured data
- [ ] UI component library
- [ ] SEO and accessibility implementation
- [ ] Performance optimization
- [ ] Production deployment
- [ ] Documentation and handover

## Deployment

### Development

The application runs on `http://localhost:4200/` during development.

### Production

Built for deployment to `/v2/` path:

```bash
npm run build:v2
```

Output location: `dist/v2/`

The production build includes:

- SSR support for better SEO and performance
- Optimized bundles with tree shaking
- Performance budgets enforcement
- `/v2/` base href configuration

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## Performance Targets

- Lighthouse Performance: ≥ 90
- Lighthouse SEO: ≥ 90  
- Lighthouse Accessibility: ≥ 90
- First Contentful Paint: < 1.5s
- Cumulative Layout Shift: < 0.1

## Contributing

1. Follow the established code style and conventions
2. Write meaningful commit messages
3. Ensure all tests pass before submitting changes
4. Update documentation when making changes to APIs or architecture

## Troubleshooting

### Common Issues

**Build errors with SCSS:**
- Ensure all `@use` statements are at the top of files
- Check mixin namespace usage (e.g., `mixins.glass-card()`)

**Development server issues:**
- Clear Angular cache: `rm -rf .angular/cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**SSR issues:**
- Ensure no browser-specific APIs are used in server context
- Use `isPlatformBrowser()` guards when necessary

## Related Documentation

- [Angular Migration Roadmap](../docs/ANGULAR_MIGRATION_ROADMAP.md)
- [Main Project README](../README.md)
- [Developer Guide](../docs/DEVELOPER_GUIDE.md)

## Support

For questions or issues related to the Angular v2 development, please refer to the project documentation or create an issue in the main repository.
