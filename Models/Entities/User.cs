﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FilmVault.Models.Entities
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public required string Username { get; set; }
        [EmailAddress]
        public required string Email { get; set; }
        [NotMapped] // never stored in database
        [StringLength(100, MinimumLength = 3)]
        public string? Password { get; set; }
        public string? PasswordHash { get; set; } // stored in database
    }
}