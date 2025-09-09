import { Component, signal } from '@angular/core';
import { LayoutShellComponent } from './layout/layout-shell/layout-shell';
import { HeroComponent } from './components/hero/hero';
import { TechStackComponent } from './components/tech-stack/tech-stack';
import { SocialLinksComponent } from './components/social-links/social-links';

@Component({
  selector: 'app-root',
  imports: [LayoutShellComponent, HeroComponent, TechStackComponent, SocialLinksComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('3dime v2');
}
