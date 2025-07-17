using Microsoft.EntityFrameworkCore;
using CoreApi.Models;

namespace CoreApi.Data
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) 
            : base(options)
        {

        }

        public DbSet<Client> Clients { get; set; }

        public DbSet<Discount> Discounts { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<ProductTag> ProductsTags { get; set; }

        public DbSet<Sale> Sales { get; set; }

        public DbSet<Tag>  Tags { get; set; }

        public DbSet<Vendor> Vendors { get; set; }

        public DbSet<Wallet> Wallets { get; set; }

        public DbSet<Invoice> Invoices { get; set; }
    }
}