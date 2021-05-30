using Microsoft.EntityFrameworkCore;
using inventory.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using newkilibraries;
using newkilibraries.inventory;
using System;
using System.Threading.Tasks;

namespace inventory.Data
{
    public interface IDbContext : IDisposable
    {
        DbSet<TEntity> Set<TEntity>() where TEntity : class;
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);

            builder.Entity<Invoice>();
            builder.Entity<AgentCustomer>().HasKey(sc => new { sc.CustomerId, sc.AgentId });
            builder.Entity<InvoicePallet>().HasKey(sc => new { sc.InvoiceId, sc.PalletId });
            builder.Entity<GoodsContainerPallet>().HasKey(sc => new { sc.GoodsContainerId, sc.PalletId });
            builder.Entity<GoodsContainerDocumentFile>().HasKey(sc => new { sc.GoodsContainerId, sc.DocumentFileId });
            builder.Entity<ContainerPlanPalletPlan>().HasKey(sc => new { sc.ContainerPlanId, sc.PalletPlanId });
            builder.Entity<ContainerPlanDocumentFile>().HasKey(sc => new { sc.ContainerPlanId, sc.DocumentFileId });
            builder.Entity<InvoiceBox>().HasKey(sc => new { sc.InvoiceId, sc.BoxId });
            builder.Entity<InvoiceDocumentFile>().HasKey(sc => new { sc.InvoiceId, sc.DocumentFileId });
            builder.Entity<BillDocumentFile>().HasKey(sc => new { sc.BillId, sc.DocumentFileId });

            builder.Entity<Proforma>();
            builder.Entity<ProformaProformaItem>().HasKey(sc => new { sc.ProformaId, sc.ProformaItemId });
            builder.Entity<ProformaDocumentFile>().HasKey(sc => new { sc.ProformaId, sc.DocumentFileId });
            builder.Entity<OrderDocumentFile>().HasKey(sc => new { sc.OrderId, sc.DocumentFileId });
            builder.Entity<InvoiceDataView>().HasKey(sc => new { sc.InvoiceId });
            builder.Entity<CustomerDataView>().HasKey(sc => sc.CustomerId);
            builder.Entity<CommercialInvoiceDataView>().HasKey(sc => sc.CommercialInvoiceId);
            builder.Entity<CommercialInvoice>().HasKey(sc => sc.CommercialInvoiceId);
            builder.Entity<PalletDataView>().HasKey(sc => sc.PalletId);
            builder.Entity<VendorDataView>().HasKey(sc => sc.VendorId);
            builder.Entity<BoxDataView>().HasKey(sc => sc.BoxId);
            builder.Entity<BillDataView>().HasKey(sc => sc.BillId);
            builder.Entity<BillBankDataView>().HasKey(sc => sc.BillId);
            builder.Entity<ProformaDataView>().HasKey(sc => sc.ProformaId);
            builder.Entity<Setting>().HasKey(sc => sc.Id);
            builder.Entity<CommercialInvoiceDocumentFile>().HasKey(sc => new { sc.CommercialInvoiceId, sc.DocumentFileId });
            builder.Entity<Bill>().Property(f => f.BillId).ValueGeneratedOnAdd();
            builder.Entity<DatabaseLog>().Property(f => f.DatabaseLogId).ValueGeneratedOnAdd();
            builder.Entity<CommercialInvoiceExtra>().HasKey(p => p.CommercialInvoiceExtraId);
        }

        public DbSet<ApplicationUser> ApplicationUser { get; set; }
        public DbSet<Bill> Bill { get; set; }
        public DbSet<Agent> Agent { get; set; }
        public DbSet<Currency> Currency { get; set; }
        public DbSet<Customer> Customer { get; set; }
        public DbSet<Invoice> Invoice { get; set; }
        public DbSet<Pallet> Pallet { get; set; }
        public DbSet<Box> Box { get; set; }
        public DbSet<Vendor> Vendor { get; set; }
        public DbSet<UserProfile> UserProfile { get; set; }
        public DbSet<AgentCustomer> AgentCustomer { get; set; }
        public DbSet<InvoicePallet> InvoicePallet { get; set; }
        public DbSet<InvoiceBox> InvoiceBox { get; set; }
        public DbSet<DocumentFile> DocumentFile { get; set; }
        public DbSet<InvoiceDocumentFile> InvoiceDocumentFile { get; set; }
        public DbSet<BillDocumentFile> BillDocumentFile { get; set; }
        public DbSet<Proforma> Proforma { get; set; }
        public DbSet<ProformaProformaItem> ProformaProformaItem { get; set; }
        public DbSet<ProformaItem> ProformaItem { get; set; }
        public DbSet<ProformaDocumentFile> ProformaDocumentFile { get; set; }
        public DbSet<Leave> Leave { get; set; }
        public DbSet<GoodsContainer> GoodsContainer { get; set; }
        public DbSet<ContainerPlan> ContainerPlan { get; set; }
        public DbSet<PalletPlan> PalletPlan { get; set; }
        public DbSet<GoodsContainerPallet> GoodsContainerPallet { get; set; }
        public DbSet<ContainerPlanPalletPlan> ContainerPlanPalletPlan { get; set; }
        public DbSet<GoodsContainerDocumentFile> GoodsContainerDocumentFile { get; set; }
        public DbSet<ContainerPlanDocumentFile> ContainerPlanDocumentFile { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderDocumentFile> OrderDocumentFile { get; set; }
        public DbSet<DatabaseLog> DatabaseLogs { get; set; }
        public DbSet<InvoiceDataView> InvoiceDataView { get; set; }
        public DbSet<CustomerDataView> CustomerDataView { get; set; }
        public DbSet<PalletDataView> PalletDataView { get; set; }
        public DbSet<BoxDataView> BoxDataView { get; set; }
        public DbSet<VendorDataView> VendorDataView { get; set; }
        public DbSet<PalletFilter> PalletFilter { get; set; }
        public DbSet<BoxFilter> BoxFilter { get; set; }
        public DbSet<BillDataView> BillDataView { get; set; }
        public DbSet<BillBankDataView> BillBankDataView { get; set; }
        public DbSet<ProformaDataView> ProformaDataView { get; set; }
        public DbSet<CommercialInvoiceDataView> CommercialInvoiceDataView { get; set; }
        public DbSet<CommercialInvoice> CommercialInvoice { get; set; }
        public DbSet<CommercialInvoiceExtra> CommercialInvoiceExtra { get; set; }
        public DbSet<RequestStatus> RequestStatus { get; set; }
        public DbSet<AlertDataView> AlertDataView { get; set; }
        public DbSet<Setting> Setting { get; set; }
    }
}
