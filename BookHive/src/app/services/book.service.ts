import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book } from '../models/book.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all books
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`);
  }

  // Get a specific book by ID
  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`);
  }

  // Add a new book
  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/books`, book);
  }

  // Update an existing book
  updateBook(id: number, updatedBook: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/books/${id}`, updatedBook);
  }

  // Delete a book
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/books/${id}`);
  }

  // Search books by query (title, author, ISBN, or genre)
  searchBooks(query: string): Observable<Book[]> {
    return this.http
      .get<Book[]>(`${this.apiUrl}/books`)
      .pipe(
        map((books) =>
          books.filter(
            (book) =>
              book.title.toLowerCase().includes(query.toLowerCase()) ||
              book.author.toLowerCase().includes(query.toLowerCase()) ||
              book.isbn.toLowerCase().includes(query.toLowerCase()) ||
              (book.genre &&
                book.genre.toLowerCase().includes(query.toLowerCase()))
          )
        )
      );
  }

  // Get the latest 5 books (for Table View)
  getLatestBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/latest`);
  }

  // Get the oldest 10 books (for List View)
  getOldestBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/oldest`);
  }

  // Get books grouped by author (for Donut Chart View)
  getBooksByAuthor(): Observable<{ author: string; noOfBooks: number }[]> {
    return this.http.get<{ author: string; noOfBooks: number }[]>(
      `${this.apiUrl}/books/grouped-by-author`
    );
  }
}
