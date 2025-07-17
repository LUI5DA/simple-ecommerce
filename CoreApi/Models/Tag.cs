using System.ComponentModel.DataAnnotations;

namespace CoreApi
{
    public class Tag
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string name {get; set; } = string.Empty;
    }
}