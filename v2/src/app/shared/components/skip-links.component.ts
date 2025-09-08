import { Component } from '@angular/core';

@Component({
  selector: 'app-skip-links',
  standalone: true,
  imports: [],
  template: `
    <nav class="skip-links" role="navigation" aria-label="Skip navigation">
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#primary-navigation" class="skip-link">Skip to navigation</a>
    </nav>
  `,
  styles: [`
    .skip-links {
      position: absolute;
      top: 0;
      left: 0;
      z-index: var(--z-index-tooltip);
    }

    .skip-link {
      position: absolute;
      top: -40px;
      left: 8px;
      z-index: var(--z-index-tooltip);
      background: var(--color-bg-primary);
      color: var(--color-text-primary);
      padding: var(--space-2) var(--space-4);
      text-decoration: none;
      border: 2px solid var(--color-primary);
      font-weight: var(--font-weight-medium);
      transition: top var(--duration-fast) var(--ease-out);
    }

    .skip-link:focus {
      top: 8px;
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .skip-link:hover:focus {
      background: var(--color-primary);
      color: var(--color-bg-primary);
    }
  `]
})
export class SkipLinksComponent {

}