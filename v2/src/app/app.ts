import { Component } from '@angular/core';
import { LayoutShellComponent } from './shared/layout/layout-shell.component';

@Component({
  selector: 'app-root',
  imports: [LayoutShellComponent],
  template: '<app-layout-shell></app-layout-shell>',
  styleUrl: './app.scss'
})
export class App {

}
