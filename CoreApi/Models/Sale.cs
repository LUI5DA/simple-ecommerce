using System.ComponentModel.DataAnnotations;

namespace CoreApi.Models
{
    public class Sale
    {
        public Guid Id { set; get; } = Guid.NewGuid();

        [Required]
        public Product Product_Ref { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "The amount of products must be valid")]
        public int Ammount { get; set; } = 1;

        [Required]
        public Invoice Invoice_Ref { get; set; }
    }
}