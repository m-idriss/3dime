import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavigationComponent } from '../components/navigation.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NavigationComponent],
  template: `
    <header class="header" role="banner">
      <div class="header-container">
        <div class="logo-section">
          <a routerLink="/" class="logo-link" aria-label="3dime - Go to homepage">
            <img 
              src="logo.png" 
              alt="3dime logo"
              class="logo"
              width="40"
              height="40"
            />
            <span class="site-title">3dime</span>
          </a>
        </div>
        
        <app-navigation></app-navigation>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: var(--z-index-sticky);
      background: var(--glass-bg);
      backdrop-filter: var(--glass-backdrop-filter);
      border-bottom: 1px solid var(--glass-border);
      box-shadow: var(--shadow-glass-sm);
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) var(--space-6);
    }

    .logo-section {
      display: flex;
      align-items: center;
    }

    .logo-link {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      text-decoration: none;
      color: var(--color-text-primary);
      transition: all var(--duration-normal) var(--ease-out);
    }

    .logo-link:hover {
      color: var(--color-primary);
      transform: translateY(-1px);
    }

    .logo-link:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .logo {
      width: 40px;
      height: 40px;
      border-radius: var(--border-radius);
    }

    .site-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .header-container {
        padding: var(--space-3) var(--space-4);
      }

      .logo {
        width: 32px;
        height: 32px;
      }

      .site-title {
        font-size: var(--font-size-lg);
      }
    }
  `]
})
export class HeaderComponent {

}