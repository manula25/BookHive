import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { APP_ROUTES } from './app/app.routes';
import { HeaderComponent } from './app/components/header/header.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { ThemeService } from './app/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="container mt-5 mb-5">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
})
export class App {
  constructor(private themeService: ThemeService) {
    // Initialize theme from local storage if available
    this.themeService.initializeTheme();
  }
}

// Bootstrap the application
bootstrapApplication(App, {
  providers: [provideRouter(APP_ROUTES), provideHttpClient()],
});
