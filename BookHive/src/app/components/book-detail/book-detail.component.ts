import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="book-detail-container">
      <div *ngIf="loading" class="loader-container">
        <div class="loader"></div>
      </div>

      <div *ngIf="!loading && !book" class="not-found fade-in">
        <i class="fas fa-exclamation-circle not-found-icon"></i>
        <h2>Book Not Found</h2>
        <p>The book you're looking for doesn't exist or has been removed.</p>
        <div class="not-found-actions">
          <a routerLink="/" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i> Back to Books
          </a>
        </div>
      </div>

      <div *ngIf="!loading && book" class="book-detail fade-in">
        <div class="book-detail-header">
          <a routerLink="/" class="back-link">
            <i class="fas fa-arrow-left"></i> Back to Books
          </a>
        </div>

        <div class="book-content">
          <div class="book-cover-container scale-in">
            <img
              [src]="book.coverUrl"
              [alt]="book.title + ' cover'"
              class="book-cover"
            />
            <div class="book-rating" *ngIf="book.rating">
              <div class="stars">
                <i
                  *ngFor="let star of getStars(book.rating)"
                  class="fas"
                  [ngClass]="
                    star === 'full'
                      ? 'fa-star'
                      : star === 'half'
                      ? 'fa-star-half-alt'
                      : 'fa-star'
                  "
                  [style.opacity]="star === 'empty' ? '0.3' : '1'"
                >
                </i>
              </div>
              <span class="rating-value">{{ book.rating }}/5</span>
            </div>
          </div>

          <div class="book-info slide-in">
            <h1 class="book-title">{{ book.title }}</h1>
            <h2 class="book-author">by {{ book.author }}</h2>

            <div class="book-meta">
              <div class="meta-item">
                <i class="fas fa-calendar-alt"></i>
                <span>Published: {{ formatDate(book.publicationDate) }}</span>
              </div>

              <div class="meta-item">
                <i class="fas fa-barcode"></i>
                <span>ISBN: {{ book.isbn }}</span>
              </div>

              <div class="meta-item" *ngIf="book.genre">
                <i class="fas fa-bookmark"></i>
                <span
                  >Genre:
                  <span
                    class="badge"
                    [ngClass]="'badge-' + getGenreClass(book.genre)"
                    >{{ book.genre }}</span
                  ></span
                >
              </div>
            </div>

            <div class="book-description" *ngIf="book.description">
              <h3>Description</h3>
              <p>{{ book.description }}</p>
            </div>

            <div class="book-actions">
              <a
                [routerLink]="['/books', book.id, 'edit']"
                class="btn btn-primary"
              >
                <i class="fas fa-edit"></i> Edit Book
              </a>
              <button (click)="confirmDelete()" class="btn btn-danger">
                <i class="fas fa-trash-alt"></i> Delete Book
              </button>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div
          *ngIf="showDeleteModal"
          class="modal-backdrop"
          (click)="cancelDelete()"
        >
          <div class="modal scale-in" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h4 class="modal-title">Confirm Delete</h4>
              <button class="modal-close" (click)="cancelDelete()">×</button>
            </div>
            <div class="modal-body">
              <p>
                Are you sure you want to delete <strong>{{ book.title }}</strong
                >?
              </p>
              <p class="text-danger">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" (click)="cancelDelete()">
                Cancel
              </button>
              <button class="btn btn-danger" (click)="deleteBook()">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  book: Book | undefined;
  loading = true;
  showDeleteModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadBook(Number(id));
      }
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.bookService.getBook(id).subscribe((book) => {
      this.book = book;
      this.loading = false;
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getGenreClass(genre: string): string {
    const genreMap: { [key: string]: string } = {
      Fiction: 'primary',
      'Non-fiction': 'secondary',
      Fantasy: 'accent',
      'Science Fiction': 'primary',
      Romance: 'accent',
      Mystery: 'secondary',
      Thriller: 'danger',
      Horror: 'danger',
      Biography: 'success',
      Classic: 'success',
      'Coming-of-age': 'warning',
      Dystopian: 'danger',
      Historical: 'warning',
    };

    return genreMap[genre] || 'primary';
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }

    if (halfStar) {
      stars.push('half');
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push('empty');
    }

    return stars;
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  deleteBook(): void {
    if (this.book) {
      this.bookService.deleteBook(this.book.id).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error deleting book:', error);
          this.showDeleteModal = false;
        },
      });
    }
  }
}
