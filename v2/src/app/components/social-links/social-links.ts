import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../shared/services/content.service';
import { SocialLink } from '../../shared/models/content.model';

@Component({
  selector: 'app-social-links',
  imports: [CommonModule],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss'
})
export class SocialLinksComponent implements OnInit {
  protected readonly socialLinks = signal<SocialLink[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly error = signal<string | null>(null);

  constructor(protected contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.getSocialLinks().subscribe({
      next: (links) => {
        this.socialLinks.set(links);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading social links:', error);
        this.error.set('Failed to load social links');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Handle social link click for analytics
   */
  onSocialClick(link: SocialLink): void {
    // Could add analytics tracking here
    console.log(`Social link clicked: ${link.platform}`);
  }

  /**
   * Track by function for better performance
   */
  trackByLink(index: number, link: SocialLink): string {
    return link.url;
  }
}