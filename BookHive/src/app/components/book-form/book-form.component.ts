import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="book-form-container slide-in">
      <div class="book-form-header">
        <a routerLink="/" class="back-link">
          <i class="fas fa-arrow-left"></i> Back to Books
        </a>
        <h1>{{ isEditMode ? 'Edit Book' : 'Add New Book' }}</h1>
      </div>

      <div *ngIf="loading" class="loader-container">
        <div class="loader"></div>
      </div>

      <div
        *ngIf="!loading && !bookFound && isEditMode"
        class="not-found fade-in"
      >
        <i class="fas fa-exclamation-circle not-found-icon"></i>
        <h2>Book Not Found</h2>
        <p>The book you're trying to edit doesn't exist or has been removed.</p>
        <div class="not-found-actions">
          <a routerLink="/" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i> Back to Books
          </a>
        </div>
      </div>

      <div *ngIf="showSuccess" class="success-message fade-in">
        <i class="fas fa-check-circle success-icon"></i>
        <span>{{ successMessage }}</span>
      </div>

      <form
        *ngIf="!loading && bookForm && (bookFound || !isEditMode)"
        [formGroup]="bookForm"
        (ngSubmit)="onSubmit()"
        class="book-form"
      >
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="title" class="form-label"
              >Title <span class="required">*</span></label
            >
            <input
              type="text"
              id="title"
              formControlName="title"
              class="form-control"
              [ngClass]="{ 'is-invalid': showErrors && f['title'].errors }"
            />
            <div
              *ngIf="showErrors && f['title'].errors"
              class="invalid-feedback"
            >
              <div *ngIf="f['title'].errors?.['required']">
                Title is required
              </div>
            </div>
          </div>

          <div class="form-group col-md-6">
            <label for="author" class="form-label"
              >Author <span class="required">*</span></label
            >
            <input
              type="text"
              id="author"
              formControlName="author"
              class="form-control"
              [ngClass]="{ 'is-invalid': showErrors && f['author'].errors }"
            />
            <div
              *ngIf="showErrors && f['author'].errors"
              class="invalid-feedback"
            >
              <div *ngIf="f['author'].errors?.['required']">
                Author is required
              </div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="isbn" class="form-label"
              >ISBN <span class="required">*</span></label
            >
            <input
              type="text"
              id="isbn"
              formControlName="isbn"
              class="form-control"
              [ngClass]="{ 'is-invalid': showErrors && f['isbn'].errors }"
              (input)="normalizeIsbn($event)"
            />
            <div
              *ngIf="showErrors && f['isbn'].errors"
              class="invalid-feedback"
            >
              <div *ngIf="f['isbn'].errors?.['required']">ISBN is required</div>
              <div *ngIf="f['isbn'].errors?.['pattern']">
                ISBN must be a valid ISBN-10 (e.g., 0123456789 or 0-123-45678-9)
              </div>
            </div>
          </div>

          <div class="form-group col-md-6">
            <label for="publicationDate" class="form-label"
              >Publication Date <span class="required">*</span></label
            >
            <input
              type="date"
              id="publicationDate"
              formControlName="publicationDate"
              class="form-control"
              [ngClass]="{
                'is-invalid': showErrors && f['publicationDate'].errors
              }"
            />
            <div
              *ngIf="showErrors && f['publicationDate'].errors"
              class="invalid-feedback"
            >
              <div *ngIf="f['publicationDate'].errors?.['required']">
                Publication date is required
              </div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="genre" class="form-label">Genre</label>
            <select id="genre" formControlName="genre" class="form-control">
              <option value="">Select Genre</option>
              <option *ngFor="let genre of genres" [value]="genre">
                {{ genre }}
              </option>
            </select>
          </div>

          <div class="form-group col-md-6">
            <label for="rating" class="form-label">Rating</label>
            <div class="rating-input">
              <input
                type="range"
                id="rating"
                formControlName="rating"
                min="0"
                max="5"
                step="0.1"
                class="form-range"
              />
              <span class="rating-value"
                >{{ bookForm.get('rating')?.value || 0 }}/5</span
              >
            </div>
            <div class="rating-stars">
              <i
                *ngFor="
                  let star of getStars(bookForm.get('rating')?.value || 0)
                "
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
          </div>
        </div>

        <div class="form-group">
          <label for="coverUrl" class="form-label"
            >Cover Image URL <span class="required">*</span></label
          >
          <input
            type="text"
            id="coverUrl"
            formControlName="coverUrl"
            class="form-control"
            [ngClass]="{ 'is-invalid': showErrors && f['coverUrl'].errors }"
          />
          <div
            *ngIf="showErrors && f['coverUrl'].errors"
            class="invalid-feedback"
          >
            <div *ngIf="f['coverUrl'].errors?.['required']">
              Cover image URL is required
            </div>
            <div *ngIf="f['coverUrl'].errors?.['pattern']">
              Enter a valid URL
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            formControlName="description"
            class="form-control"
            rows="4"
          ></textarea>
        </div>

        <div class="preview-section" *ngIf="bookForm.get('coverUrl')?.value">
          <h3>Cover Preview</h3>
          <div class="cover-preview">
            <img
              [src]="bookForm.get('coverUrl')?.value"
              alt="Book cover preview"
              class="preview-image"
              onerror="this.src='https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'; this.onerror=null;"
            />
          </div>
        </div>

        <div class="form-actions">
          <button
            type="button"
            class="btn btn-outline"
            (click)="navigateBack()"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {{ isEditMode ? 'Update Book' : 'Add Book' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./book-form.component.scss'],
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  isEditMode = false;
  loading = false;
  bookId?: number;
  bookFound = true;
  showErrors = false;
  showSuccess = false;
  successMessage = '';

  genres = [
    'Fiction',
    'Non-fiction',
    'Fantasy',
    'Science Fiction',
    'Romance',
    'Mystery',
    'Thriller',
    'Horror',
    'Biography',
    'Historical',
    'Classic',
    'Coming-of-age',
    'Dystopian',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.bookId = Number(id);
        this.loadBook(this.bookId);
      }
    });
  }

  initForm(): void {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d- ]+[0-9xX]$/
          ),
        ],
      ],
      publicationDate: ['', Validators.required],
      coverUrl: [
        '',
        [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)],
      ],
      description: [''],
      genre: [''],
      rating: [0],
    });
  }

  normalizeIsbn(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.trim().replace(/\s+/g, '-');
    value = value.replace(/[^0-9xX-]/g, '');
    this.bookForm.get('isbn')?.setValue(value, { emitEvent: false });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        if (book) {
          this.bookForm.patchValue({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publicationDate: this.formatDateForInput(book.publicationDate),
            coverUrl: book.coverUrl,
            description: book.description || '',
            genre: book.genre || '',
            rating: book.rating || 0,
          });
          this.bookFound = true;
        } else {
          this.bookFound = false;
        }
        this.loading = false;
      },
      error: () => {
        this.bookFound = false;
        this.loading = false;
      },
    });
  }

  get f() {
    return this.bookForm.controls;
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  onSubmit(): void {
    this.showErrors = true;
    if (this.bookForm.valid) {
      this.loading = true;
      const bookData = this.bookForm.value;

      if (this.isEditMode && this.bookId) {
        this.bookService.updateBook(this.bookId, bookData).subscribe({
          next: (response: any) => {
            this.showSuccess = true;
            this.successMessage =
              response.message || 'Book updated successfully';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error updating book:', error);
            this.loading = false;
          },
        });
      } else {
        this.bookService.addBook(bookData).subscribe({
          next: (book) => {
            this.showSuccess = true;
            this.successMessage = 'Book added successfully';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error adding book:', error);
            this.loading = false;
          },
        });
      }
    }
  }

  navigateBack(): void {
    if (this.isEditMode && this.bookId) {
      this.router.navigate(['/books', this.bookId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
