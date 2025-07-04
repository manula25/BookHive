import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found-container fade-in">
      <div class="not-found-content">
        <div class="not-found-image">
          <i class="fas fa-book-dead"></i>
        </div>
        <h1 class="not-found-title">404</h1>
        <h2 class="not-found-subtitle">Page Not Found</h2>
        <p class="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="not-found-actions">
          <a routerLink="/" class="btn btn-primary">
            <i class="fas fa-home"></i> Back to Home
          </a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {}