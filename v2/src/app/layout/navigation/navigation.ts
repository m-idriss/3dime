import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-navigation',
  imports: [],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class NavigationComponent {
  protected readonly isProfileOptionsOpen = signal(false);

  onLogoClick(): void {
    window.location.reload();
  }

  toggleProfileOptions(): void {
    this.isProfileOptionsOpen.update(value => !value);
  }
}
