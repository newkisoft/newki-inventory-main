using Microsoft.EntityFrameworkCore;
using newkilibraries;
using newkilibraries.website;

namespace inventory.Data
{
    public class WebsiteDbContext :DbContext
    {
        public WebsiteDbContext(DbContextOptions options):base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
            builder.Entity<Order>().ToTable("Order");
            builder.Entity<WebsitePallet>().ToTable("WebsitePallet");
            builder.Entity<OrderProduct>().ToTable("OrderProduct").HasKey(p=>new {p.ProductId, p.OrderId});

        }

        public DbSet<newkilibraries.DtyPrice> DtyPrice { get; set; }        
        public DbSet<newkilibraries.DtyPriceArchive> DtyPriceArchive { get; set; }        
        public DbSet<newkilibraries.FdyPrice> FdyPrice { get; set; }        
        public DbSet<newkilibraries.FdyPriceArchive> FdyPriceArchive { get; set; }        
        public DbSet<newkilibraries.TfoPrice> TfoPrice { get; set; }        
        public DbSet<newkilibraries.TfoPriceArchive> TfoPriceArchive { get; set; }        
        public DbSet<newkilibraries.SpandexPrice> SpandexPrice { get; set; }        
        public DbSet<newkilibraries.SpandexPriceArchive> SpandexPriceArchive { get; set; }        
        public DbSet<newkilibraries.BcfPrice> BcfPrice { get; set; }        
        public DbSet<newkilibraries.BcfPriceArchive> BcfPriceArchive { get; set; }        
        public DbSet<newkilibraries.ShwPrice> ShwPrice { get; set; }        
        public DbSet<newkilibraries.ShwPriceArchive> ShwPriceArchive { get; set; }        
        public DbSet<News> News{get;set;}
        public DbSet<Product> Product{get;set;}
        public DbSet<Order> Orders{get;set;}
        public DbSet<OrderProduct> OrderProducts{get;set;}
        public DbSet<OnlineProduct> OnlineProduct{get;set;}
        public DbSet<newkilibraries.WebsitePallet> WebsitePallet{get;set;}
    }
}
