import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  template: `
    <main class="projects-page">
      <h1>Projects Portfolio</h1>
      <p>Collection of projects and work experience.</p>
    </main>
  `,
  styles: [`
    .projects-page {
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
export class ProjectsComponent {

}