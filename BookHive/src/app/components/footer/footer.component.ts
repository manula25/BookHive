import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="footer-logo-text">BookHive</span>
            </div>
            <p class="footer-tagline">Your digital book management system</p>
          </div>
          <div class="footer-links">
            <div class="footer-section">
              <h5 class="footer-heading">Navigation</h5>
              <ul class="footer-nav">
                <li><a routerLink="/">Home</a></li>
                <li><a routerLink="/books/new">Add Book</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h5 class="footer-heading">Follow Us</h5>
              <div class="social-links">
                <a href="#" class="social-link" aria-label="Facebook">
                  <fa-icon [icon]="faFacebook"></fa-icon>
                </a>
                <a href="#" class="social-link" aria-label="Twitter">
                  <fa-icon [icon]="faTwitter"></fa-icon>
                </a>
                <a href="#" class="social-link" aria-label="Instagram">
                  <fa-icon [icon]="faInstagram"></fa-icon>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="copyright">
            © {{ currentYear }} BookHive. All rights reserved.
          </p>
          <p class="version">Version 1.0.0</p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  // Font Awesome icons
  faFacebook = faFacebookF;
  faTwitter = faTwitter;
  faInstagram = faInstagram;
}
