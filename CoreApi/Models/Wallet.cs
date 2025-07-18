using System.ComponentModel.DataAnnotations;

namespace CoreApi.Models
{
    public class Wallet
    {
        public Guid Id {get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; }

        [Required]
        public Client Client_Ref { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public double Balance { get; set; }

        [Required]
        public string Currency { get; set; }
    }
}