using System.ComponentModel.DataAnnotations;

namespace CoreApi.Models{
    public class Product
    {
        public Guid Id { get; set; } = Guid.NewGuid();


        [Required]
        public string Name {get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public double Price { get; set; } = 1;
    }
}