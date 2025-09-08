import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `
    <main class="about-page">
      <h1>About</h1>
      <p>Extended biography and personal information.</p>
    </main>
  `,
  styles: [`
    .about-page {
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
export class AboutComponent {

}