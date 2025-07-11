namespace AuthService.Dtos
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string Role {get; set; } = default!;
    }
}