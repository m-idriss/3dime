import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer" role="contentinfo">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">3dime</h3>
            <p class="footer-description">
              Personal Social Hub - Connecting all your digital presence in one place.
            </p>
          </div>
          
          <div class="footer-section">
            <h4 class="section-title">Social Links</h4>
            <ul class="social-links" role="list">
              <li>
                <a 
                  href="https://github.com/m-idriss" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  class="social-link"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/in/idriss-mohamed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  class="social-link"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contact@3dime.dev" 
                  aria-label="Email Contact"
                  class="social-link"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M0 4v16h24V4H0zm22 2l-10 6L2 6h20zm-20 2.5l6.5 4.5L2 15.5v-7zm7.5 5.5l2.5 1.5 2.5-1.5L20 17H4l6.5-3.5z"/>
                  </svg>
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="copyright">
            &copy; {{ currentYear }} 3dime. All rights reserved.
          </p>
          <p class="version">
            v2.0 - Built with Angular
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-bg-secondary);
      border-top: 1px solid var(--color-border-secondary);
      margin-top: auto;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-12) var(--space-6) var(--space-6);
    }

    .footer-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-8);
      margin-bottom: var(--space-8);
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .footer-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
      margin: 0;
    }

    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
    }

    .footer-description {
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .social-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .social-link {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      color: var(--color-text-secondary);
      text-decoration: none;
      padding: var(--space-2);
      transition: all var(--duration-normal) var(--ease-out);
      font-weight: var(--font-weight-medium);
    }

    .social-link:hover {
      color: var(--color-primary);
      transform: translateX(4px);
    }

    .social-link:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--space-6);
      border-top: 1px solid var(--color-border-secondary);
    }

    .copyright,
    .version {
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      margin: 0;
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .footer-container {
        padding: var(--space-8) var(--space-4) var(--space-4);
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: var(--space-6);
      }

      .footer-bottom {
        flex-direction: column;
        gap: var(--space-2);
        text-align: center;
      }

      .social-links {
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--space-4);
      }
    }
  `]
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();
}