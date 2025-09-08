import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <main class="home-page">
      <h1>3dime v2 - Home</h1>
      <p>Welcome to the Angular version of 3dime personal social hub.</p>
    </main>
  `,
  styles: [`
    .home-page {
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
export class HomeComponent {

}