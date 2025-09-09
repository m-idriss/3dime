import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../shared/services/content.service';
import { Technology } from '../../shared/models/content.model';

@Component({
  selector: 'app-tech-stack',
  imports: [CommonModule],
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.scss'
})
export class TechStackComponent implements OnInit {
  protected readonly technologies = signal<Technology[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly error = signal<string | null>(null);

  constructor(protected contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.getTechnologies().subscribe({
      next: (technologies) => {
        this.technologies.set(technologies);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading technologies:', error);
        this.error.set('Failed to load technology stack');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Handle technology link click
   */
  onTechClick(tech: Technology, event: Event): void {
    if (tech.url) {
      // Let the default link behavior handle the navigation
      return;
    }
    
    // Prevent navigation if no URL
    event.preventDefault();
  }

  /**
   * Track by function for better performance
   */
  trackByTech(index: number, tech: Technology): string {
    return tech.name;
  }
}