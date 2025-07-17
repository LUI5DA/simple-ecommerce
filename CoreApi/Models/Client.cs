using System.ComponentModel.DataAnnotations;

namespace CoreApi.Models
{
    public class Client
    {

        public Guid UserId { get; set; } = Guid.NewGuid();

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "The Email must be valid.")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone(ErrorMessage = "The Phone number must be valid.")]
        public string Telephone { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string LasName { get; set; } = string.Empty;
    }
}