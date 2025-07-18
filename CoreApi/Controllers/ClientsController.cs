using Microsoft.AspNetCore.Mvc;
using CoreApi.Data;
using CoreApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController: ControllerBase
    {
        private readonly AuthDbContext _context;

        public ClientsController(AuthDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet("search")]
        public ActionResult<IEnumerable<Product>> SearchProduct([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("La consulta de búsqueda no puede estar vacía.");
            }

            query = query.ToLower();

            var products1 = _context.Products
                .Where(p => (p.Name.ToLower().Contains(query) || p.Description.ToLower().Contains(query)))
                .ToList();

            var products2 = _context.ProductsTags
                .Where(pt => pt.Tag_Ref.Name.ToLower().Contains(query))
                .Select(pt => pt.Product)
                .Distinct()
                .ToList();

            var allProducts = products1.Union(products2).ToList();

            return Ok(allProducts);
        }

        [HttpGet("{clientId}")]
        public ActionResult<IEnumerable<Wallet>> getWallets([FromQuery] Guid clientId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || userIdClaim != userId.ToString())
            {
                return Forbid();
            }

            var wallets = _context.Wallets
                .Where(w = w.Client_Ref.Id == clientId)
                .ToList();

            return ok(wallets);
        }

        [HttpPost]
        
    }
}