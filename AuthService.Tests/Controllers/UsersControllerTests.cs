using Xunit;
using AuthService.Controllers;
using AuthService.Data;
using AuthService.Models;
using AuthService.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System;

namespace AuthService.Tests.Controllers
{
    public class UsersControllerTests
    {
        private AuthDbContext GetInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<AuthDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AuthDbContext(options);
        }

        [Fact]
        public void CreateUser_ShouldReturnCreatedUser()
        {
            // Arrange
            var context = GetInMemoryDb();
            var controller = new UsersController(context);
            var request = new UserCreateDto
            {
                Username = "testuser",
                Email = "test@example.com",
                Password = "Password123!",
                Role = "Admin"
            };

            var result = controller.Create(request);


            // Assert
            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var user = Assert.IsType<UserDto>(created.Value);
            Assert.Equal("testuser", user.Username);
        }

    }
}
