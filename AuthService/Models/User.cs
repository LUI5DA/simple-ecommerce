using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class User  
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MinLength(3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [RegularExpression("Client|Vendor|Admin", ErrorMessage = "Role must be Client, Vendor, or Admin")]
        public string Role { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
