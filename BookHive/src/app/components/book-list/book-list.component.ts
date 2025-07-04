import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="book-list-container">
      <div class="book-list-header">
        <h1>Book Collection</h1>
      </div>

      <div class="search-filter-row">
        <div class="search-container">
          <input
            type="text"
            class="search-input"
            placeholder="Search by title, author, or genre..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="applyFilters()"
          />
          <button
            *ngIf="searchTerm"
            class="search-clear"
            (click)="clearSearch()"
            aria-label="Clear search"
          >
            ✕
          </button>
        </div>

        <div class="book-filters">
          <select
            [(ngModel)]="sortBy"
            (change)="applyFilters()"
            aria-label="Sort by"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="publicationDate">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>

          <select
            [(ngModel)]="sortDirection"
            (change)="applyFilters()"
            aria-label="Sort direction"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <select
            *ngIf="genres.length > 0"
            [(ngModel)]="genreFilter"
            (change)="applyFilters()"
            aria-label="Filter by genre"
          >
            <option value="">All Genres</option>
            <option *ngFor="let genre of genres" [value]="genre">
              {{ genre }}
            </option>
          </select>
        </div>
      </div>

      <div *ngIf="loading" class="loader-container">
        <div class="loader"></div>
      </div>

      <div *ngIf="!loading && filteredBooks.length === 0" class="no-results">
        <div class="no-results-content">
          <p>No books found</p>
          <a routerLink="/books/new" class="add-book-btn">Add New Book</a>
        </div>
      </div>

      <div *ngIf="!loading && filteredBooks.length > 0" class="book-grid">
        <div *ngFor="let book of filteredBooks" class="book-card">
          <div class="book-card-image">
            <img [src]="book.coverUrl" [alt]="book.title + ' cover'" />
            <div class="book-card-rating" *ngIf="book.rating">
              {{ book.rating }}
            </div>
          </div>
          <div class="book-card-content">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <div class="book-meta">
              <span class="book-genre" *ngIf="book.genre">{{
                book.genre
              }}</span>
              <span class="book-date">{{
                formatDate(book.publicationDate)
              }}</span>
            </div>
            <div class="book-actions">
              <a [routerLink]="['/books', book.id]" class="action-btn view-btn"
                >View</a
              >
              <a
                [routerLink]="['/books', book.id, 'edit']"
                class="action-btn edit-btn"
                >Edit</a
              >
              <button
                (click)="confirmDelete(book)"
                class="action-btn delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button -->
      <a routerLink="/books/new" class="fab-button" aria-label="Add new book">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </a>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-backdrop">
        <div class="modal">
          <div class="modal-content">
            <h4>Delete Book</h4>
            <p>Are you sure you want to delete "{{ bookToDelete?.title }}"?</p>
            <div class="modal-actions">
              <button class="cancel-btn" (click)="cancelDelete()">
                Cancel
              </button>
              <button class="confirm-btn" (click)="deleteBook()">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  genres: string[] = [];
  loading = true;
  searchTerm = '';
  sortBy = 'title';
  sortDirection = 'asc';
  genreFilter = '';

  // Delete modal state
  showDeleteModal = false;
  bookToDelete: Book | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.extractGenres();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
      },
    });
  }

  extractGenres(): void {
    const genreSet = new Set<string>();
    this.books.forEach((book) => {
      if (book.genre) {
        genreSet.add(book.genre);
      }
    });
    this.genres = Array.from(genreSet).sort();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  applyFilters(): void {
    // First filter by search term and genre
    this.filteredBooks = this.books.filter((book) => {
      const matchesSearch = this.searchTerm
        ? book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (book.genre &&
            book.genre.toLowerCase().includes(this.searchTerm.toLowerCase()))
        : true;

      const matchesGenre = this.genreFilter
        ? book.genre === this.genreFilter
        : true;

      return matchesSearch && matchesGenre;
    });

    // Then sort the filtered books
    this.filteredBooks.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'publicationDate':
          comparison =
            new Date(a.publicationDate).getTime() -
            new Date(b.publicationDate).getTime();
          break;
        case 'rating':
          const ratingA = a['rating'] || 0;
          const ratingB = b['rating'] || 0;
          comparison = ratingA - ratingB;
          break;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  }

  confirmDelete(book: Book): void {
    this.bookToDelete = book;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.bookToDelete = null;
  }

  deleteBook(): void {
    if (this.bookToDelete) {
      this.bookService.deleteBook(this.bookToDelete.id).subscribe({
        next: () => {
          this.loadBooks();
          this.showDeleteModal = false;
          this.bookToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting book:', error);
          this.showDeleteModal = false;
          this.bookToDelete = null;
        },
      });
    }
  }
}
