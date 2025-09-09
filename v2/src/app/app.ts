import { Component, signal } from '@angular/core';
import { LayoutShellComponent } from './layout/layout-shell/layout-shell';

@Component({
  selector: 'app-root',
  imports: [LayoutShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('3dime v2');
}
