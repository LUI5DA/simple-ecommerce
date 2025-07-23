using System.ComponentModel.DataAnnotations;

namespace CoreApi.Models
{
    public class Tag
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string name {get; set; } = string.Empty;
    }
}