/* ==========================================================================
   Content Service - 3dime v2
   Service for loading and transforming structured data
   ========================================================================== */

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';
import {
  PersonSchema,
  ProcessedContent,
  ContentResponse,
  ContentLoadingState,
  SocialLink,
  Technology,
} from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly contentSubject = new BehaviorSubject<ProcessedContent | null>(null);
  private readonly loadingSubject = new BehaviorSubject<ContentLoadingState>({
    profile: false,
    technologies: false,
    experience: false,
    education: false,
    hobbies: false,
    socialLinks: false,
  });

  // Public observables
  public readonly content$ = this.contentSubject.asObservable();
  public readonly loading$ = this.loadingSubject.asObservable();

  // Public signals for reactive UI
  public readonly content = signal<ProcessedContent | null>(null);
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  private readonly socialPlatformMap: Record<string, { platform: string; icon: string; color: string }> = {
    'github.com': { platform: 'GitHub', icon: 'fab fa-github', color: '#333' },
    'linkedin.com': { platform: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0077B5' },
    'x.com': { platform: 'X (Twitter)', icon: 'fab fa-x-twitter', color: '#1DA1F2' },
    'twitter.com': { platform: 'X (Twitter)', icon: 'fab fa-x-twitter', color: '#1DA1F2' },
    'facebook.com': { platform: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2' },
    'instagram.com': { platform: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F' },
  };

  private readonly technologyIconMap: Record<string, { icon: string; color: string }> = {
    'Java': { icon: 'fab fa-java', color: '#ED8B00' },
    'JavaScript': { icon: 'fab fa-js-square', color: '#F7DF1E' },
    'Docker': { icon: 'fab fa-docker', color: '#2496ED' },
    'Spring Boot': { icon: 'fas fa-leaf', color: '#6DB33F' },
    'PostgreSQL': { icon: 'fas fa-database', color: '#336791' },
    'MongoDB': { icon: 'fab fa-envira', color: '#47A248' },
    'Quarkus': { icon: 'fas fa-rocket', color: '#4695EB' },
    'Agile': { icon: 'fas fa-sync-alt', color: '#00D4AA' },
  };

  constructor(private http: HttpClient) {
    this.loadContent();
  }

  /**
   * Load content from structured-data.jsonld
   */
  public loadContent(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Load from parent directory (root of project)
    this.http.get<PersonSchema>('/structured-data.jsonld')
      .pipe(
        map(data => this.transformStructuredData(data)),
        catchError(error => {
          console.error('Error loading structured data:', error);
          this.error.set('Failed to load content. Using fallback data.');
          return of(this.getFallbackContent());
        }),
        tap(processedContent => {
          this.content.set(processedContent);
          this.contentSubject.next(processedContent);
          this.isLoading.set(false);
        }),
        shareReplay(1)
      )
      .subscribe({
        next: (content) => {
          console.log('Content loaded successfully:', content);
        },
        error: (error) => {
          console.error('Failed to process content:', error);
          this.isLoading.set(false);
        }
      });
  }

  /**
   * Transform raw structured data into UI-friendly format
   */
  private transformStructuredData(data: PersonSchema): ProcessedContent {
    return {
      profile: {
        name: data.name,
        title: data.jobTitle,
        description: data.description,
        location: `${data.address.addressLocality}, ${data.address.addressCountry}`,
        email: data.email,
        image: data.image,
      },
      socialLinks: this.transformSocialLinks(data.sameAs),
      technologies: this.transformTechnologies(data.knowsAbout),
      education: data.alumniOf || [],
      experience: data.workExperience || [],
      hobbies: data.hobbies || [],
      personalItems: data.owns || [],
    };
  }

  /**
   * Transform sameAs URLs into social links with icons and colors
   */
  private transformSocialLinks(urls: string[]): SocialLink[] {
    return urls.map(url => {
      const domain = this.extractDomain(url);
      const platformInfo = this.socialPlatformMap[domain];
      
      return {
        platform: platformInfo?.platform || domain,
        url,
        username: this.extractUsername(url),
        icon: platformInfo?.icon || 'fas fa-external-link-alt',
        color: platformInfo?.color || '#666',
      };
    });
  }

  /**
   * Transform knowsAbout into technology objects with icons
   */
  private transformTechnologies(technologies: Technology[]): Technology[] {
    return technologies.map(tech => {
      const iconInfo = this.technologyIconMap[tech.name];
      
      return {
        ...tech,
        icon: iconInfo?.icon || 'fas fa-code',
        color: iconInfo?.color || '#00D4AA',
      };
    });
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.startsWith('www.') ? domain.substring(4) : domain;
    } catch {
      return url;
    }
  }

  /**
   * Extract username from social media URL
   */
  private extractUsername(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      const segments = pathname.split('/').filter(Boolean);
      return segments[0] || '';
    } catch {
      return '';
    }
  }

  /**
   * Fallback content when structured data fails to load
   */
  private getFallbackContent(): ProcessedContent {
    return {
      profile: {
        name: 'Idriss Mohamady',
        title: 'Back End Developer',
        description: 'Tech enthusiast and lifelong learner. French of Malagasy origin, living in Nice with my wife and children. I love building elegant solutions that keep things simple.',
        location: 'Nice, France',
        email: 'contact@3dime.com',
        image: '/assets/logo.png',
      },
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/m-idriss', icon: 'fab fa-github', color: '#333' },
        { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/i-mohamady/', icon: 'fab fa-linkedin', color: '#0077B5' },
        { platform: 'X (Twitter)', url: 'https://x.com/3dime13', icon: 'fab fa-x-twitter', color: '#1DA1F2' },
      ],
      technologies: [
        { '@type': 'Thing', name: 'Java', url: 'https://www.java.com', icon: 'fab fa-java', color: '#ED8B00' },
        { '@type': 'Thing', name: 'Quarkus', url: 'https://quarkus.io', icon: 'fas fa-rocket', color: '#4695EB' },
        { '@type': 'Thing', name: 'Spring Boot', url: 'https://spring.io/projects/spring-boot', icon: 'fas fa-leaf', color: '#6DB33F' },
        { '@type': 'Thing', name: 'Docker', url: 'https://www.docker.com', icon: 'fab fa-docker', color: '#2496ED' },
      ],
      education: [],
      experience: [],
      hobbies: [],
      personalItems: [],
    };
  }

  /**
   * Get specific content section
   */
  public getProfile(): Observable<ProcessedContent['profile'] | null> {
    return this.content$.pipe(
      map(content => content?.profile || null)
    );
  }

  public getTechnologies(): Observable<Technology[]> {
    return this.content$.pipe(
      map(content => content?.technologies || [])
    );
  }

  public getSocialLinks(): Observable<SocialLink[]> {
    return this.content$.pipe(
      map(content => content?.socialLinks || [])
    );
  }

  /**
   * Refresh content data
   */
  public refresh(): void {
    this.loadContent();
  }
}