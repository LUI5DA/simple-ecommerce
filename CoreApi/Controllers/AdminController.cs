using Microsoft.AspNetCore.Mvc;
using CoreApi.Data;
using CoreApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace CoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public AdminController(AuthDbContext context)
        {
            _context = context;
        }

        // Este endpoint es llamado por el AuthService cuando se registra un nuevo cliente
        [HttpPost("clients")]
        [AllowAnonymous] // Solo para comunicación entre servicios
        public async Task<IActionResult> CreateClient([FromBody] ClientRegistrationDto clientDto)
        {
            var client = new Client
            {
                Id = clientDto.Id,
                Name = clientDto.Name,
                LasName = clientDto.LasName,
                Email = clientDto.Email,
                Location = clientDto.Location,
                Telephone = clientDto.Telephone,
                IsBanned = false
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return Ok(client);
        }

        // Este endpoint es llamado por el AuthService cuando se registra un nuevo vendor
        [HttpPost("vendors")]
        [AllowAnonymous] // Solo para comunicación entre servicios
        public async Task<IActionResult> CreateVendor([FromBody] VendorRegistrationDto vendorDto)
        {
            var vendor = new Vendor
            {
                Id = vendorDto.Id,
                Name = vendorDto.Name,
                Email = vendorDto.Email,
                Location = vendorDto.Location,
                Telephone = vendorDto.Telephone,
                IsApproved = vendorDto.IsApproved,
                IsBanned = false
            };

            _context.Vendors.Add(vendor);
            await _context.SaveChangesAsync();

            return Ok(vendor);
        }
    }

    // DTOs para la comunicación entre servicios
    public class ClientRegistrationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LasName { get; set; }
        public string Email { get; set; }
        public string Location { get; set; }
        public string Telephone { get; set; }
    }

    public class VendorRegistrationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Location { get; set; }
        public string Telephone { get; set; }
        public bool IsApproved { get; set; }
    }
}