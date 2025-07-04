import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
  <nav class="navbar">
    <div class="navbar-left">
      <a class="logo" routerLink="/">
        <img src="assets/logo.svg" alt="BookHive Logo" class="logo-img" />
        <span class="logo-text">BookHive</span>
      </a>

      <ul class="nav-links">
        <li><a routerLink="/" routerLinkActive="active">Home</a></li>
        <li><a routerLink="/booking" routerLinkActive="active">Booking</a></li>
        <li><a routerLink="/library" routerLinkActive="active">My Library</a></li>
        <li><a routerLink="/about" routerLinkActive="active">About</a></li>
      </ul>
    </div>

    <div class="navbar-right">
      <button class="theme-btn" (click)="toggleTheme()">
        <i class="fas fa-moon"></i>
      </button>
      <button class="mobile-menu-toggle" (click)="toggleMenu()">☰</button>
    </div>
  </nav>

  <!-- Search bar under the logo -->
  <div class="search-container">
    <input type="text" placeholder="Search for books..." />
    <button><i class="fas fa-search"></i></button>
  </div>

  <!-- Mobile menu -->
  <div class="mobile-menu" [class.open]="menuOpen">
    <ul class="mobile-nav-links">
      <li><a routerLink="/" routerLinkActive="active">Home</a></li>
      <li><a routerLink="/booking" routerLinkActive="active">Booking</a></li>
      <li><a routerLink="/library" routerLinkActive="active">My Library</a></li>
      <li><a routerLink="/about" routerLinkActive="active">About</a></li>
      <li>
        <button class="theme-btn-mobile" (click)="toggleTheme()">
          <i class="fas fa-moon"></i> Dark Mode
        </button>
      </li>
    </ul>
  </div>
</header>

  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  menuOpen = false;

  constructor(private themeService: ThemeService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

