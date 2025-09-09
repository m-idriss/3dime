import { Component } from '@angular/core';

@Component({
  selector: 'app-skip-links',
  imports: [],
  templateUrl: './skip-links.html',
  styleUrl: './skip-links.scss'
})
export class SkipLinksComponent {
  focusElement(elementId: string): void {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}
