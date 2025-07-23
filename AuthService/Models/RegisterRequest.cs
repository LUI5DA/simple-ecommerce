using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class RegisterRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; } // Cliente, Vendor o Admin

        // Campos adicionales para el perfil
        [Required]
        public string Name { get; set; }
        
        public string LastName { get; set; } // Requerido solo para clientes
        
        [Required]
        public string Location { get; set; }
        
        [Required]
        [Phone]
        public string Telephone { get; set; }
    }
}