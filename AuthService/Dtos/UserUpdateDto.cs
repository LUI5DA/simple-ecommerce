using System.ComponentModel.DataAnnotations;

namespace AuthService.Dtos
{
    public class UserUpdateDto
    {
        [Required]
        public string Username { get; set; } = default!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = default!;
    }
}
