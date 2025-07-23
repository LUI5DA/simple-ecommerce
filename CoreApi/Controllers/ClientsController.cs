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
                .Where(pt => pt.Tag_Ref.name.ToLower().Contains(query))
                .Select(pt => pt.Product_Ref)
                .Distinct()
                .ToList();

            var allProducts = products1.Union(products2).ToList();

            return Ok(allProducts);
        }

        [HttpGet("wallets")]
        public ActionResult<IEnumerable<Wallet>> GetWallets()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var client = _context.Clients.FirstOrDefault(c => c.Id == userId);
            if (client == null)
            {
                return NotFound("Cliente no encontrado");
            }

            var wallets = _context.Wallets
                .Where(w => w.Client_Ref.Id == userId)
                .ToList();

            return Ok(wallets);
        }

        [HttpPost("wallets")]
        public ActionResult<Wallet> CreateWallet(Wallet wallet)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var client = _context.Clients.FirstOrDefault(c => c.Id == userId);
            if (client == null)
            {
                return NotFound("Cliente no encontrado");
            }

            wallet.Client_Ref = client;
            _context.Wallets.Add(wallet);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetWallets), new { }, wallet);
        }

        [HttpGet("purchases")]
        public ActionResult<IEnumerable<Invoice>> GetPurchaseHistory()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var client = _context.Clients.FirstOrDefault(c => c.Id == userId);
            if (client == null)
            {
                return NotFound("Cliente no encontrado");
            }

            var invoices = _context.Invoices
                .Where(i => i.Client_Ref.Id == userId)
                .ToList();

            // Obtener las ventas asociadas a cada factura
            foreach (var invoice in invoices)
            {
                var sales = _context.Sales
                    .Where(s => s.Invoice_Ref.Id == invoice.Id)
                    .Include(s => s.Product_Ref)
                    .ToList();
            }

            return Ok(invoices);
        }

        [HttpPost("purchase")]
        public ActionResult<Invoice> PurchaseProducts([FromBody] PurchaseRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Forbid();
            }

            var userId = Guid.Parse(userIdClaim);
            var client = _context.Clients.FirstOrDefault(c => c.Id == userId);
            if (client == null)
            {
                return NotFound("Cliente no encontrado");
            }

            var wallet = _context.Wallets.FirstOrDefault(w => w.Id == request.WalletId && w.Client_Ref.Id == userId);
            if (wallet == null)
            {
                return NotFound("Wallet no encontrada");
            }

            // Calcular el total de la compra
            double totalAmount = 0;
            foreach (var item in request.Items)
            {
                var product = _context.Products.Find(item.ProductId);
                if (product == null)
                {
                    return NotFound($"Producto con ID {item.ProductId} no encontrado");
                }
                totalAmount += product.Price * item.Quantity;
            }

            // Verificar si hay suficiente saldo
            if (wallet.Balance < totalAmount)
            {
                return BadRequest("Saldo insuficiente en la wallet");
            }

            // Crear la factura
            var invoice = new Invoice
            {
                Client_Ref = client
            };
            _context.Invoices.Add(invoice);

            // Crear las ventas asociadas a la factura
            foreach (var item in request.Items)
            {
                var product = _context.Products.Find(item.ProductId);
                var sale = new Sale
                {
                    Product_Ref = product,
                    Ammount = item.Quantity,
                    Invoice_Ref = invoice
                };
                _context.Sales.Add(sale);
            }

            // Actualizar el saldo de la wallet
            wallet.Balance -= totalAmount;

            _context.SaveChanges();

            return CreatedAtAction(nameof(GetPurchaseHistory), new { }, invoice);
        }

        [HttpGet("products/{id}")]
        public ActionResult<Product> GetProduct(Guid id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }
    }

    public class PurchaseRequest
    {
        public Guid WalletId { get; set; }
        public List<PurchaseItem> Items { get; set; }
    }

    public class PurchaseItem
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}