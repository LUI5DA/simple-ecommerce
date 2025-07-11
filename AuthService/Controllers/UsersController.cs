using Microsoft.AspNetCore.Mvc;
using AuthService.Data;
using AuthService.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using AuthService.Dtos;
using AuthService.Utils;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public UsersController(AuthDbContext context)
        {
            _context = context;
        }

        [Authorize (Roles = "Admin")]
        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAll()
        {
            return Ok(_context.Users.ToList());
        }
        
        [Authorize]
        [HttpGet("{id}")]
        public ActionResult<User> GetById(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userId != id.ToString() && role != "Admin")
            {
                return Forbid();
            }

            var user = _context.Users.Find(id);
            if(user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult<UserDto> Create(UserCreateDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                Email = request.Email,
                PasswordHash = PasswordHasher.Hash(request.Password),
                Role = request.Role
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, ToDto(user));
        }

        [Authorize]
        [HttpPut("{id}")]
        public ActionResult<User> Update(Guid id, UserUpdateDto user)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || userIdClaim != id.ToString())
            {
                return Forbid();
            }

            var existing = _context.Users.Find(id);
            if(existing == null)
            {
                return NotFound();
            }
            existing.Username = user.Username;
            existing.Email = user.Email;
            
            _context.SaveChanges();
            return Ok(ToDto(existing));

        }

        [Authorize (Roles = "Admin")]
        [HttpDelete("{id}")]
        public ActionResult<User> Delete(Guid id)
        {
            var user = _context.Users.Find(id);
            if(user == null)
                return NotFound();

            _context.Users.Remove(user);
            _context.SaveChanges();
            return NoContent();
        }

        // Functions to map objects to DTO's

        private static UserDto ToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };
        }

    }
}