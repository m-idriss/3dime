import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation';
import { SkipLinksComponent } from '../skip-links/skip-links';

@Component({
  selector: 'app-layout-shell',
  imports: [RouterOutlet, NavigationComponent, SkipLinksComponent],
  templateUrl: './layout-shell.html',
  styleUrl: './layout-shell.scss'
})
export class LayoutShellComponent {

}
