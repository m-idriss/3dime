/* =========================
   Progressive Disclosure & Mobile UX Enhancements
   ========================= */

import { CONFIG } from './config.js';

/**
 * Enhanced mobile and progressive disclosure features
 */
export class MobileUXManager {
  constructor() {
    this.isTouch = this.detectTouch();
    this.collapsedSections = new Set();
    this.init();
  }

  /**
   * Detect touch capability
   */
  detectTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Initialize mobile UX enhancements
   */
  init() {
    this.addSwipeGestures();
    this.enhanceScrolling();
    this.addProgressiveDisclosure();
    this.optimizeForTouch();
    
    if (this.isTouch) {
      document.body.classList.add('touch-device');
      console.log('Mobile UX: Touch device detected, applying optimizations');
    }
  }

  /**
   * Add swipe gestures for section navigation
   */
  addSwipeGestures() {
    if (!this.isTouch) return;

    let startX = 0;
    let startY = 0;
    let isScrolling = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = false;
    };

    const handleTouchMove = (e) => {
      if (!startX || !startY) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      // Determine if user is scrolling vertically
      if (Math.abs(diffY) > Math.abs(diffX)) {
        isScrolling = true;
      }
    };

    const handleTouchEnd = (e) => {
      if (!startX || !startY || isScrolling) return;

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      const threshold = 50;

      // Swipe left - next theme
      if (diffX > threshold) {
        const event = new CustomEvent('swipeLeft');
        document.dispatchEvent(event);
      }
      // Swipe right - previous theme (cycle backwards)
      else if (diffX < -threshold) {
        const event = new CustomEvent('swipeRight');
        document.dispatchEvent(event);
      }

      startX = 0;
      startY = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Listen for custom swipe events
    document.addEventListener('swipeLeft', () => {
      if (window.getThemeManager) {
        const themeManager = window.getThemeManager();
        if (themeManager) {
          const newTheme = themeManager.switchToNext();
          this.showSwipeNotification(`Switched to ${newTheme.name} theme`, newTheme.icon);
        }
      }
    });
  }

  /**
   * Enhance scrolling experience
   */
  enhanceScrolling() {
    let isScrolling = false;
    let scrollTimer = null;

    const handleScroll = () => {
      if (!isScrolling) {
        document.body.classList.add('scrolling');
        isScrolling = true;
      }

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.body.classList.remove('scrolling');
        isScrolling = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Add progressive disclosure to content sections
   */
  addProgressiveDisclosure() {
    const sections = document.querySelectorAll('[aria-label]');
    
    sections.forEach((section, index) => {
      // Skip first section (profile) from progressive disclosure
      if (index === 0) return;
      
      const header = section.querySelector('h2');
      if (!header) return;

      // Create toggle button
      const toggle = document.createElement('button');
      toggle.className = 'section-toggle';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', `Toggle ${header.textContent} section`);
      toggle.innerHTML = ''; // Icon added via CSS

      // Add toggle to header
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'space-between';
      header.appendChild(toggle);

      // Handle toggle click
      toggle.addEventListener('click', () => {
        this.toggleSection(section, toggle);
      });

      // Auto-collapse sections on mobile for better initial experience
      if (window.innerWidth <= 768 && index > 2) {
        this.toggleSection(section, toggle);
      }
    });
  }

  /**
   * Toggle section visibility
   */
  toggleSection(section, toggle) {
    const isCollapsed = this.collapsedSections.has(section);
    const content = Array.from(section.children).slice(1); // All except header

    if (isCollapsed) {
      // Expand
      section.classList.remove('collapsed');
      content.forEach(el => {
        el.style.display = '';
        el.style.opacity = '0';
        setTimeout(() => el.style.opacity = '1', 10);
      });
      toggle.classList.remove('collapsed');
      toggle.setAttribute('aria-expanded', 'true');
      this.collapsedSections.delete(section);
    } else {
      // Collapse
      section.classList.add('collapsed');
      content.forEach(el => {
        el.style.opacity = '0';
        setTimeout(() => el.style.display = 'none', 200);
      });
      toggle.classList.add('collapsed');
      toggle.setAttribute('aria-expanded', 'false');
      this.collapsedSections.add(section);
    }
  }

  /**
   * Optimize interface for touch devices
   */
  optimizeForTouch() {
    if (!this.isTouch) return;

    // Increase touch targets
    const interactiveElements = document.querySelectorAll('a, button, .tech-item');
    interactiveElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      const minSize = 44; // iOS HIG minimum
      
      if (parseInt(computedStyle.height) < minSize) {
        el.style.minHeight = `${minSize}px`;
      }
      if (parseInt(computedStyle.width) < minSize) {
        el.style.minWidth = `${minSize}px`;
      }
    });

    // Add touch feedback
    interactiveElements.forEach(el => {
      el.addEventListener('touchstart', () => {
        el.classList.add('touch-active');
      }, { passive: true });

      el.addEventListener('touchend', () => {
        setTimeout(() => el.classList.remove('touch-active'), 150);
      }, { passive: true });

      el.addEventListener('touchcancel', () => {
        el.classList.remove('touch-active');
      }, { passive: true });
    });
  }

  /**
   * Show swipe gesture notification
   */
  showSwipeNotification(message, icon = '👆') {
    const notification = document.createElement('div');
    notification.className = 'swipe-notification';
    notification.innerHTML = `
      <span class="notification-icon">${icon}</span>
      <span class="notification-text">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  /**
   * Get collapsed sections info
   */
  getCollapsedInfo() {
    return {
      totalSections: document.querySelectorAll('[aria-label]').length,
      collapsedCount: this.collapsedSections.size,
      isTouch: this.isTouch
    };
  }
}