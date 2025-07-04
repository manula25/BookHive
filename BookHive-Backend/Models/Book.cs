using Microsoft.AspNetCore.Mvc;
using System;
namespace BookHive_Backend.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public DateTime PublicationDate { get; set; }
        public string CoverUrl { get; set; }
        public string Genre { get; set; }
        public double Rating { get; set; }
        public string Description { get; set; }
    }
}
