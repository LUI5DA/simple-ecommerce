using System.ComponentModel.DataAnnotations;

namespace CoreApi.Models
{
    public class Discount
    {
        public Guid Id { set; get; } = Guid.NewGuid();

        [Required]
        public Product Product_Ref { get; set; }

        public DateTime ValidUntil { get; set; }

        [Required]
        [Range(1, 100, ErrorMessage = "The percentage value must between 1 and 100.")]
        public double Percentage { get; set; }

        [Required]
        public double Priority { get; set; }
    }
}