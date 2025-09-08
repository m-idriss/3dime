import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav id="primary-navigation" class="navigation" role="navigation" aria-label="Main navigation">
      <button 
        class="mobile-menu-toggle"
        [attr.aria-expanded]="isMobileMenuOpen()"
        aria-controls="navigation-menu"
        (click)="toggleMobileMenu()"
        [class.active]="isMobileMenuOpen()"
      >
        <span class="sr-only">Toggle menu</span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <ul 
        id="navigation-menu"
        class="nav-menu"
        [class.open]="isMobileMenuOpen()"
        role="menubar"
      >
        <li role="none">
          <a 
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{exact: true}"
            class="nav-link"
            role="menuitem"
            (click)="closeMobileMenu()"
          >
            Home
          </a>
        </li>
        <li role="none">
          <a 
            routerLink="/services"
            routerLinkActive="active"
            class="nav-link"
            role="menuitem"
            (click)="closeMobileMenu()"
          >
            Services
          </a>
        </li>
        <li role="none">
          <a 
            routerLink="/projects"
            routerLinkActive="active"
            class="nav-link"
            role="menuitem"
            (click)="closeMobileMenu()"
          >
            Projects
          </a>
        </li>
        <li role="none">
          <a 
            routerLink="/about"
            routerLinkActive="active"
            class="nav-link"
            role="menuitem"
            (click)="closeMobileMenu()"
          >
            About
          </a>
        </li>
        <li role="none">
          <a 
            routerLink="/contact"
            routerLinkActive="active"
            class="nav-link"
            role="menuitem"
            (click)="closeMobileMenu()"
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .navigation {
      position: relative;
    }

    .mobile-menu-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 24px;
      height: 18px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: var(--z-index-fixed);
    }

    .hamburger-line {
      width: 100%;
      height: 2px;
      background: var(--color-text-primary);
      transition: all var(--duration-normal) var(--ease-out);
      transform-origin: center;
    }

    .mobile-menu-toggle.active .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu-toggle.active .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-toggle.active .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }

    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: var(--space-6);
    }

    .nav-link {
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-base);
      padding: var(--space-2) var(--space-3);
      transition: all var(--duration-normal) var(--ease-out);
      border-bottom: 2px solid transparent;
    }

    .nav-link:hover {
      color: var(--color-text-primary);
    }

    .nav-link.active {
      color: var(--color-primary);
      border-bottom-color: var(--color-primary);
    }

    .nav-link:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .mobile-menu-toggle {
        display: flex;
      }

      .nav-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 250px;
        height: 100vh;
        background: var(--glass-bg);
        backdrop-filter: var(--glass-backdrop-filter);
        border-left: 1px solid var(--glass-border);
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        padding: var(--space-20) var(--space-4) var(--space-4);
        gap: var(--space-4);
        transition: right var(--duration-normal) var(--ease-out);
        z-index: var(--z-index-modal);
        box-shadow: var(--shadow-glass-lg);
      }

      .nav-menu.open {
        right: 0;
      }

      .nav-link {
        padding: var(--space-4);
        border-bottom: 1px solid var(--color-border-secondary);
        border-radius: 0;
        text-align: center;
      }

      .nav-link.active {
        background: rgba(0, 212, 170, 0.1);
        border-bottom-color: var(--color-primary);
      }
    }
  `]
})
export class NavigationComponent {
  protected isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}