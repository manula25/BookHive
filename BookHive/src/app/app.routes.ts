// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/book-list/book-list.component').then(
        (m) => m.BookListComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/welcome-dashboard/welcome-dashboard.component').then(
        (m) => m.WelcomeDashboardComponent
      ),
  },
  {
    path: 'books/new',
    loadComponent: () =>
      import('./components/book-form/book-form.component').then(
        (m) => m.BookFormComponent
      ),
  },
  {
    path: 'books/:id',
    loadComponent: () =>
      import('./components/book-detail/book-detail.component').then(
        (m) => m.BookDetailComponent
      ),
  },
  {
    path: 'books/:id/edit',
    loadComponent: () =>
      import('./components/book-form/book-form.component').then(
        (m) => m.BookFormComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
