using System.ComponentModel.DataAnnotations;

namespace CoreApi.Models
{
    public class ProductTag
    {
        public Guid Id { set; get; } = Guid.NewGuid();

        [Required]
        public Product Product_Ref { get; set; }

        [Required]
        public Tag Tag_Ref { get; set; }
    }
}