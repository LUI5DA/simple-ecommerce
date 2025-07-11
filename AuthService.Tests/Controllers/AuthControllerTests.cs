using Xunit;
using AuthService.Controllers;
using AuthService.Data;
using AuthService.Models;
using AuthService.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System;
using AuthService.Utils;

namespace AuthService.Tests.Controllers
{
    public class AuthControllerTests
    {
        private AuthDbContext GetInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<AuthDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AuthDbContext(options);
        }

        [Fact]
        public void Login_ShouldReturnToken_WhenCredentialsAreValid()
        {
            // Arrange
            var context = GetInMemoryDb();
            var jwtSettings = new JwtSettings
            {
                SecretKey = "supersecretkey_for_testing_purposes_only_123456",
                Issuer = "TestIssuer",
                Audience = "TestAudience",
                ExpiryMinutes = 60
            };
            var authController = new AuthController(context, jwtSettings);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = "loginuser",
                Email = "login@example.com",
                PasswordHash = PasswordHasher.Hash("Test1234!"),
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(user);
            context.SaveChanges();

            var loginRequest = new LoginRequest
            {
                Email = "login@example.com",
                Password = "Test1234!"  
            };

            // Act
            var result = authController.Login(loginRequest);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var tokenResponse = okResult.Value?.GetType().GetProperty("token")?.GetValue(okResult.Value, null) as string;

            Assert.False(string.IsNullOrWhiteSpace(tokenResponse));
        }

    }
}
