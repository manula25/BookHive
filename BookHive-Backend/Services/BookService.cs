// BookHive-Backend/Services/BookService.cs
using BookHive_Backend.Models;

namespace BookHive_Backend.Services
{
    public class BookService
    {
        private static List<Book> _books = new List<Book>
        {
            new Book
            {
                Id = 1,
                Title = "The Great Gatsby",
                Author = "F. Scott Fitzgerald",
                ISBN = "9780743273565",
                PublicationDate = new DateTime(1925, 4, 10),
                CoverUrl = "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
                Genre = "Classic",
                Rating = 4.5,
                Description = "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan."
            }
        };
        private static int _nextId = 2;

        public List<Book> GetAll() => _books;

        public Book? GetById(int id) => _books.FirstOrDefault(b => b.Id == id);

        public Book Add(Book book)
        {
            book.Id = _nextId++;
            _books.Add(book);
            return book;
        }

        public bool Update(int id, Book updatedBook)
        {
            var book = GetById(id);
            if (book == null) return false;

            book.Title = updatedBook.Title;
            book.Author = updatedBook.Author;
            book.ISBN = updatedBook.ISBN;
            book.PublicationDate = updatedBook.PublicationDate;
            book.CoverUrl = updatedBook.CoverUrl;
            book.Genre = updatedBook.Genre;
            book.Rating = updatedBook.Rating;
            book.Description = updatedBook.Description;
            return true;
        }

        public bool Delete(int id)
        {
            var book = GetById(id);
            if (book == null) return false;

            _books.Remove(book);
            return true;
        }

        // New method: Get the latest 5 books (sorted by PublicationDate or Id)
        public List<Book> GetLatestBooks()
        {
            return _books
                .OrderByDescending(b => b.PublicationDate)
                .ThenByDescending(b => b.Id)
                .Take(5)
                .ToList();
        }

        // New method: Get the oldest 10 books (sorted by PublicationDate or Id)
        public List<Book> GetOldestBooks()
        {
            return _books
                .OrderBy(b => b.PublicationDate)
                .ThenBy(b => b.Id)
                .Take(10)
                .ToList();
        }

        // New method: Get books grouped by author
        public List<object> GetBooksByAuthor()
        {
            return _books
                .GroupBy(b => b.Author)
                .Select(g => new { Author = g.Key, NoOfBooks = g.Count() })
                .ToList<object>();
        }
    }
}