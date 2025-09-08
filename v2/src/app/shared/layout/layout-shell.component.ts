import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SkipLinksComponent } from '../components/skip-links.component';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [RouterOutlet, SkipLinksComponent, HeaderComponent, FooterComponent],
  template: `
    <!-- Background Video -->
    <video class="background-video" autoplay muted loop playsinline>
      <source src="background.mp4" type="video/mp4">
    </video>
    
    <app-skip-links></app-skip-links>
    
    <div class="layout-shell">
      <app-header></app-header>
      
      <main id="main-content" class="main-content" role="main">
        <router-outlet></router-outlet>
      </main>
      
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .background-video {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -3;
      opacity: 0.3;
    }
    
    .layout-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
    }

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--space-6);
      position: relative;
      z-index: 2;
    }

    /* Focus management for SPA navigation */
    .main-content:focus {
      outline: none;
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .main-content {
        padding: var(--space-4);
      }
    }
  `]
})
export class LayoutShellComponent {

}