import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  template: `
    <main class="contact-page">
      <h1>Contact</h1>
      <p>Contact form and information.</p>
    </main>
  `,
  styles: [`
    .contact-page {
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
export class ContactComponent {

}