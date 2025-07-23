using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Models;
using AuthService.Data;
using Microsoft.AspNetCore.Authorization;
using AuthService.Utils;
using System.Net.Http;
using System.Net.Http.Json;



namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public AuthController(AuthDbContext context, JwtSettings jwtSettings, 
                            IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context;
            _jwtSettings = jwtSettings;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

            if(user == null || !PasswordHasher.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized();
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
                signingCredentials: creds
            );

            return Ok(new {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = new { user.Id, user.Username, user.Email, user.Role }
            });
        }
        
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            // Verificar si el usuario ya existe
            if (_context.Users.Any(u => u.Email == request.Email))
            {
                return BadRequest("Emaial already exists");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            // Crear el nuevo usuario
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = PasswordHasher.Hash(request.Password),
                Role = request.Role // Cliente, Vendor o Admin
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Crear el perfil correspondiente en CoreApi según el rol
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                var coreApiUrl = _configuration["ServiceUrls:CoreApi"];
                
                if (request.Role == "Client")
                {
                    var clientData = new
                    {
                        Id = user.Id,
                        Name = request.Name,
                        LasName = request.LastName,
                        Email = request.Email,
                        Location = request.Location,
                        Telephone = request.Telephone
                    };
                    
                    await httpClient.PostAsJsonAsync($"{coreApiUrl}/api/admin/clients", clientData);
                }
                else if (request.Role == "Vendor")
                {
                    var vendorData = new
                    {
                        Id = user.Id,
                        Name = request.Name,
                        Email = request.Email,
                        Location = request.Location,
                        Telephone = request.Telephone,
                        IsApproved = false // Los vendors requieren aprobación
                    };
                    
                    await httpClient.PostAsJsonAsync($"{coreApiUrl}/api/admin/vendors", vendorData);
                }
                
                // Generar token para el nuevo usuario
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _jwtSettings.Issuer,
                    audience: _jwtSettings.Audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
                    signingCredentials: creds
                );

                return Ok(new {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    user = new { user.Id, user.Username, user.Email, user.Role }
                });
            }
            catch (Exception ex)
            {
                // Si falla la creación en CoreApi, eliminar el usuario de AuthService
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                
                return StatusCode(500, $"Error al registrar el usuario en el sistema: {ex.Message}");
            }
        }

    }
}