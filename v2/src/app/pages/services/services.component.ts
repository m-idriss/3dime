import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  template: `
    <main class="services-page">
      <h1>Services & Skills</h1>
      <p>Showcase of services and technical skills.</p>
    </main>
  `,
  styles: [`
    .services-page {
      padding: var(--space-4);
      color: var(--color-text-primary);
    }
    
    h1 {
      color: var(--color-text-accent);
      font-size: var(--font-size-3xl);
      margin-bottom: var(--space-4);
    }
  `]
})
export class ServicesComponent {

}