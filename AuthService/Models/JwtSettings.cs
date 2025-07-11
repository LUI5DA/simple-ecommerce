namespace AuthService.Models
{
    public class JwtSettings 
    {
        public string SecretKey { get; set; } = string.Empty;
        public string Issuer { get; set; } = "AuthService";
        public string Audience { get; set; } = "AuthServiceUsers"; 
        public int ExpiryMinutes { get; set; } = 60;
    }
}