using System.ComponentModel.DataAnnotations;

namespace CoreApi.Models
{
    public class Vendor
    {
        public Guid UserId { get; set; } 

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "The email address must be valid.")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone(ErrorMessage = "The Phone number must be valid.")]
        public string Telephone { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;
    }
}