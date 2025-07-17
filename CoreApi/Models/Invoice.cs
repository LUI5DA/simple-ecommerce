using System.ComponentModel.DataAnnotations;

namespace CoreApi.Models
{
    public class Invoice
    {
        public Guid Id { set; get; } = Guid.NewGuid();

        [Required]
        public Client Client_Ref { get; set; }
    }
}