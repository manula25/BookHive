using Microsoft.AspNetCore.Mvc;
using BookHive_Backend.Models;
using BookHive_Backend.Services;
using System.Linq;

namespace BookHive_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookService _bookService;

        public BooksController(BookService bookService)
        {
            _bookService = bookService;
        }

        // Get all books
        [HttpGet]
        public ActionResult<IEnumerable<Book>> GetAll()
        {
            var books = _bookService.GetAll();
            return Ok(books);
        }

        // Get a book by ID
        [HttpGet("{id}")]
        public ActionResult<Book> GetById(int id)
        {
            var book = _bookService.GetById(id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        // Create a new book
        [HttpPost]
        public ActionResult<Book> Create([FromBody] Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdBook = _bookService.Add(book);
            return CreatedAtAction(nameof(GetById), new { id = createdBook.Id }, createdBook);
        }

        // Update a book
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!_bookService.Update(id, book))
            {
                return NotFound();
            }
            return Ok(new { message = "Book updated successfully" });
        }

        // Delete a book
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_bookService.Delete(id))
            {
                return NotFound();
            }
            return NoContent();
        }

        // 01. Get Latest 5 Books (Table View)
        [HttpGet("latest")]
        public ActionResult<IEnumerable<Book>> GetLatestBooks()
        {
            // Assuming books are added with a timestamp or can be sorted by the Id or CreatedDate
            var latestBooks = _bookService.GetAll()
                                          .OrderByDescending(b => b.Id) // Or order by AddedDate if you have it
                                          .Take(5)
                                          .ToList();
            var result = latestBooks.Select(b => new
            {
                b.Id,
                b.Title,
                b.Author,
                b.ISBN
            });

            return Ok(result);
        }

        // 02. Get Oldest 10 Books (List View)
        [HttpGet("oldest")]
        public ActionResult<IEnumerable<Book>> GetOldestBooks()
        {
            // Get the oldest 10 books based on the Id or CreatedDate
            var oldestBooks = _bookService.GetAll()
                                          .OrderBy(b => b.Id) // Or order by AddedDate if you have it
                                          .Take(10)
                                          .ToList();
            var result = oldestBooks.Select(b => new
            {
                b.Id,
                b.Title,
                b.ISBN,
                b.PublicationDate
            });

            return Ok(result);
        }

        // 03. Group by Author and Count Books (Donut Chart View)
        [HttpGet("grouped-by-author")]
        public ActionResult<IEnumerable<object>> GetBooksGroupedByAuthor()
        {
            var groupedBooks = _bookService.GetAll()
                                           .GroupBy(b => b.Author)
                                           .Select(g => new
                                           {
                                               Author = g.Key,
                                               NoOfBooks = g.Count()
                                           })
                                           .ToList();

            return Ok(groupedBooks);
        }
    }
}