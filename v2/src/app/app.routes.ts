import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
    title: '3dime - Personal Social Hub',
    data: { description: 'Welcome to 3dime, your personal social hub to regroup and share profiles & links.' }
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(c => c.ServicesComponent),
    title: '3dime - Services & Skills',
    data: { description: 'Showcase of professional services and technical skills.' }
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then(c => c.ProjectsComponent),
    title: '3dime - Projects Portfolio',
    data: { description: 'Collection of projects and work experience.' }
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(c => c.AboutComponent),
    title: '3dime - About',
    data: { description: 'Extended biography and personal information.' }
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(c => c.ContactComponent),
    title: '3dime - Contact',
    data: { description: 'Get in touch - contact form and information.' }
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
