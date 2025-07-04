import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Chart, registerables } from 'chart.js';
import { Book } from '../../models/book.model';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-welcome-dashboard',
  template: `
    <div class="dashboard-container">
      <div *ngIf="isLoading" class="loading">Loading...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <!-- Table View Widget: Latest 5 Books -->
      <div class="widget">
        <h2>Latest 5 Books</h2>
        <table *ngIf="latestBooks.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let book of latestBooks">
              <td>{{ book.id }}</td>
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.isbn }}</td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="latestBooks.length === 0 && !isLoading" class="no-data">
          No data available
        </p>
      </div>

      <!-- List View Widget: Oldest 10 Books -->
      <div class="widget">
        <h2>Oldest 10 Books</h2>
        <ul *ngIf="oldestBooks.length > 0">
          <li *ngFor="let book of oldestBooks">
            {{ book.id }} - {{ book.title }} (ISBN: {{ book.isbn }}, Published:
            {{ book.publicationDate | date : 'shortDate' }})
          </li>
        </ul>
        <p *ngIf="oldestBooks.length === 0 && !isLoading" class="no-data">
          No data available
        </p>
      </div>

      <!-- Donut Chart Widget: Books by Author -->
      <div class="widget">
        <h2>Books by Author</h2>
        <canvas id="donutChart" *ngIf="booksByAuthor.length > 0"></canvas>
        <p *ngIf="booksByAuthor.length === 0 && !isLoading" class="no-data">
          No data available
        </p>
      </div>
    </div>
  `,
  styleUrls: ['./welcome-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class WelcomeDashboardComponent implements OnInit, OnDestroy {
  latestBooks: Book[] = [];
  oldestBooks: Book[] = [];
  booksByAuthor: { author: string; noOfBooks: number }[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  private chart: Chart | undefined;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadLatestBooks();
    this.loadOldestBooks();
    this.loadBooksByAuthor();
  }

  loadLatestBooks(): void {
    this.isLoading = true;
    this.bookService.getLatestBooks().subscribe({
      next: (data) => {
        this.latestBooks = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load latest books';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  loadOldestBooks(): void {
    this.isLoading = true;
    this.bookService.getOldestBooks().subscribe({
      next: (data) => {
        this.oldestBooks = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load oldest books';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  loadBooksByAuthor(): void {
    this.isLoading = true;
    this.bookService.getBooksByAuthor().subscribe({
      next: (data) => {
        this.booksByAuthor = data;
        this.isLoading = false;

        // Wait for DOM to update before rendering the chart
        setTimeout(() => this.renderDonutChart(), 0);
      },
      error: (err) => {
        this.error = 'Failed to load books by author';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  renderDonutChart(): void {
    const canvas = document.getElementById('donutChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas.getContext('2d')!, {
      type: 'doughnut',
      data: {
        labels: this.booksByAuthor.map((item) => item.author),
        datasets: [
          {
            data: this.booksByAuthor.map((item) => item.noOfBooks),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#8E44AD',
              '#2ECC71',
              '#E74C3C',
              '#3498DB',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Books by Author' },
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
