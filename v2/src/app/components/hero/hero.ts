import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../shared/services/content.service';
import { ProcessedContent } from '../../shared/models/content.model';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent implements OnInit {
  protected readonly profile = signal<ProcessedContent['profile'] | null>(null);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly error = signal<string | null>(null);

  constructor(protected contentService: ContentService) {}

  ngOnInit(): void {
    // Subscribe to content service
    this.contentService.getProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error.set('Failed to load profile information');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Handle email click
   */
  onEmailClick(): void {
    const profile = this.profile();
    if (profile?.email) {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  /**
   * Handle image load error
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/logo.png'; // Fallback to logo
  }
}