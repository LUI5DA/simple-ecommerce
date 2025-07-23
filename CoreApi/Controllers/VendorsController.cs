using Microsoft.AspNetCore.Mvc;
using CoreApi.Data;
using CoreApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace CoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VendorsController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public VendorsController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet("products")]
        public ActionResult<IEnumerable<Product>> GetVendorProducts()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var vendor = _context.Vendors.FirstOrDefault(v => v.Id == userId);
            if (vendor == null)
            {
                return NotFound("Vendor no encontrado");
            }

            var products = _context.Products
                .Where(p => p.Vendor_Id == vendor.Id)
                .ToList();

            return Ok(products);
        }

        [HttpPost("products")]
        public ActionResult<Product> CreateProduct([FromBody] Product product)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var vendor = _context.Vendors.FirstOrDefault(v => v.Id == userId);
            if (vendor == null)
            {
                return NotFound("Vendor no encontrado");
            }

            // Asignar el vendor al producto
            product.Vendor_Id = vendor.Id;
            
            _context.Products.Add(product);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpGet("products/{id}")]
        public ActionResult<Product> GetProduct(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var vendor = _context.Vendors.FirstOrDefault(v => v.Id == userId);
            if (vendor == null)
            {
                return NotFound("Vendor no encontrado");
            }

            var product = _context.Products.FirstOrDefault(p => p.Id == id && p.Vendor_Id == vendor.Id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPut("products/{id}")]
        public ActionResult<Product> UpdateProduct(Guid id, [FromBody] Product product)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var vendor = _context.Vendors.FirstOrDefault(v => v.Id == userId);
            if (vendor == null)
            {
                return NotFound("Vendor no encontrado");
            }

            var existingProduct = _context.Products.FirstOrDefault(p => p.Id == id && p.Vendor_Id == vendor.Id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;

            _context.SaveChanges();

            return Ok(existingProduct);
        }

        [HttpDelete("products/{id}")]
        public ActionResult DeleteProduct(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var vendor = _context.Vendors.FirstOrDefault(v => v.Id == userId);
            if (vendor == null)
            {
                return NotFound("Vendor no encontrado");
            }

            var product = _context.Products.FirstOrDefault(p => p.Id == id && p.Vendor_Id == vendor.Id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpGet("sales")]
        public ActionResult<IEnumerable<Sale>> GetVendorSales()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var vendor = _context.Vendors.FirstOrDefault(v => v.Id == userId);
            if (vendor == null)
            {
                return NotFound("Vendor no encontrado");
            }

            var sales = _context.Sales
                .Include(s => s.Product_Ref)
                .Where(s => s.Product_Ref.Vendor_Id == vendor.Id)
                .ToList();

            // Cargar las facturas asociadas a las ventas
            foreach (var sale in sales)
            {
                _context.Entry(sale)
                    .Reference(s => s.Invoice_Ref)
                    .Load();
            }

            return Ok(sales);
        }

        [HttpGet("revenue")]
        public ActionResult<object> GetVendorRevenue()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var vendor = _context.Vendors.FirstOrDefault(v => v.Id == userId);
            if (vendor == null)
            {
                return NotFound("Vendor no encontrado");
            }

            var sales = _context.Sales
                .Include(s => s.Product_Ref)
                .Where(s => s.Product_Ref.Vendor_Id == vendor.Id)
                .ToList();

            double totalRevenue = sales.Sum(s => s.Product_Ref.Price * s.Ammount);
            int totalSales = sales.Count;
            int totalProductsSold = sales.Sum(s => s.Ammount);

            return Ok(new
            {
                TotalRevenue = totalRevenue,
                TotalSales = totalSales,
                TotalProductsSold = totalProductsSold
            });
        }

        [HttpPost("products/{productId}/tags")]
        public ActionResult AddTagToProduct(Guid productId, [FromBody] Guid tagId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var vendor = _context.Vendors.FirstOrDefault(v => v.Id == userId);
            if (vendor == null)
            {
                return NotFound("Vendor no encontrado");
            }

            var product = _context.Products.FirstOrDefault(p => p.Id == productId && p.Vendor_Id == vendor.Id);
            if (product == null)
            {
                return NotFound("Producto no encontrado o no pertenece a este vendor");
            }

            var tag = _context.Tags.Find(tagId);
            if (tag == null)
            {
                return NotFound("Tag no encontrado");
            }

            // Verificar si ya existe la relación
            var existingProductTag = _context.ProductsTags
                .FirstOrDefault(pt => EF.Property<Guid>(pt.Product_Ref, "Id") == productId && 
                                  EF.Property<Guid>(pt.Tag_Ref, "Id") == tagId);

            if (existingProductTag != null)
            {
                return BadRequest("El tag ya está asociado a este producto");
            }

            var productTag = new ProductTag
            {
                Product_Ref = product,
                Tag_Ref = tag
            };

            _context.ProductsTags.Add(productTag);
            _context.SaveChanges();

            return Ok();
        }

        [HttpDelete("products/{productId}/tags/{tagId}")]
        public ActionResult RemoveTagFromProduct(Guid productId, Guid tagId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var vendor = _context.Vendors.FirstOrDefault(v => v.Id == userId);
            if (vendor == null)
            {
                return NotFound("Vendor no encontrado");
            }

            var product = _context.Products.FirstOrDefault(p => p.Id == productId && p.Vendor_Id == vendor.Id);
            if (product == null)
            {
                return NotFound("Producto no encontrado o no pertenece a este vendor");
            }

            var productTag = _context.ProductsTags
                .FirstOrDefault(pt => EF.Property<Guid>(pt.Product_Ref, "Id") == productId && 
                                  EF.Property<Guid>(pt.Tag_Ref, "Id") == tagId);

            if (productTag == null)
            {
                return NotFound("El tag no está asociado a este producto");
            }

            _context.ProductsTags.Remove(productTag);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpGet("tags")]
        public ActionResult<IEnumerable<Tag>> GetAllTags()
        {
            var tags = _context.Tags.ToList();
            return Ok(tags);
        }
    }
}