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
    [Authorize(Roles = "Admin")]
    public class AdminsController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public AdminsController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet("vendors/pending")]
        public ActionResult<IEnumerable<Vendor>> GetPendingVendors()
        {
            var pendingVendors = _context.Vendors
                .Where(v => v.IsApproved == false)
                .ToList();

            return Ok(pendingVendors);
        }

        [HttpPost("vendors/{vendorId}/approve")]
        public ActionResult ApproveVendor(Guid vendorId)
        {
            var vendor = _context.Vendors.Find(vendorId);
            if (vendor == null)
            {
                return NotFound("Vendor no encontrado");
            }

            vendor.IsApproved = true;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("vendors/{vendorId}/reject")]
        public ActionResult RejectVendor(Guid vendorId)
        {
            var vendor = _context.Vendors.Find(vendorId);
            if (vendor == null)
            {
                return NotFound("Vendor no encontrado");
            }

            _context.Vendors.Remove(vendor);
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet("sales")]
        public ActionResult<IEnumerable<Sale>> GetAllSales()
        {
            var sales = _context.Sales
                .Include(s => s.Product_Ref)
                .Include(s => s.Invoice_Ref)
                .ToList();

            // Cargar los clientes asociados a las facturas
            foreach (var sale in sales)
            {
                _context.Entry(sale.Invoice_Ref)
                    .Reference(i => i.Client_Ref)
                    .Load();
            }

            return Ok(sales);
        }

        [HttpPost("tags")]
        public ActionResult<Tag> CreateTag([FromBody] Tag tag)
        {
            if (_context.Tags.Any(t => t.name.ToLower() == tag.name.ToLower()))
            {
                return BadRequest("Ya existe un tag con ese nombre");
            }

            _context.Tags.Add(tag);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAllTags), new { }, tag);
        }

        [HttpGet("tags")]
        public ActionResult<IEnumerable<Tag>> GetAllTags()
        {
            var tags = _context.Tags.ToList();
            return Ok(tags);
        }

        [HttpDelete("tags/{id}")]
        public ActionResult DeleteTag(Guid id)
        {
            var tag = _context.Tags.Find(id);
            if (tag == null)
            {
                return NotFound();
            }

            // Eliminar todas las relaciones con productos
            var productTags = _context.ProductsTags
                .Where(pt => EF.Property<Guid>(pt.Tag_Ref, "Id") == id)
                .ToList();
            _context.ProductsTags.RemoveRange(productTags);

            _context.Tags.Remove(tag);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost("users/{userId}/ban")]
        public ActionResult BanUser(Guid userId)
        {
            // Aquí asumimos que hay un campo IsBanned en el modelo de usuario
            // que se gestiona en el AuthService
            var client = _context.Clients.FirstOrDefault(c => c.Id == userId);
            if (client != null)
            {
                client.IsBanned = true;
                _context.SaveChanges();
                return Ok();
            }

            var vendor = _context.Vendors.FirstOrDefault(v => v.Id == userId);
            if (vendor != null)
            {
                vendor.IsBanned = true;
                _context.SaveChanges();
                return Ok();
            }

            return NotFound("Usuario no encontrado");
        }

        [HttpPost("users/{userId}/unban")]
        public ActionResult UnbanUser(Guid userId)
        {
            var client = _context.Clients.FirstOrDefault(c => c.Id == userId);
            if (client != null)
            {
                client.IsBanned = false;
                _context.SaveChanges();
                return Ok();
            }

            var vendor = _context.Vendors.FirstOrDefault(v => v.Id == userId);
            if (vendor != null)
            {
                vendor.IsBanned = false;
                _context.SaveChanges();
                return Ok();
            }

            return NotFound("Usuario no encontrado");
        }

        [HttpGet("users")]
        public ActionResult<object> GetAllUsers()
        {
            var clients = _context.Clients.ToList();
            var vendors = _context.Vendors.ToList();

            return Ok(new
            {
                Clients = clients,
                Vendors = vendors
            });
        }

        [HttpGet("statistics")]
        public ActionResult<object> GetSystemStatistics()
        {
            int totalClients = _context.Clients.Count();
            int totalVendors = _context.Vendors.Count();
            int totalProducts = _context.Products.Count();
            int totalSales = _context.Sales.Count();
            double totalRevenue = _context.Sales.Sum(s => s.Product_Ref.Price * s.Ammount);

            return Ok(new
            {
                TotalClients = totalClients,
                TotalVendors = totalVendors,
                TotalProducts = totalProducts,
                TotalSales = totalSales,
                TotalRevenue = totalRevenue
            });
        }
    }
}