using Xunit;
using inventory.Services;
using inventory.Data;
using Moq;
using newkilibraries;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace tests
{
    public class PackageReportTest
    {
        private ApplicationDbContext appDbContext;
        public PackageReportTest()
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlite(@"Data Source=stock.db");
            appDbContext = new ApplicationDbContext(optionsBuilder.Options);
        }

        [Fact]
        public void GeneratePackageReportFromDatabase()
        {            
            var packageReport = new PackageReport(appDbContext);
            var commercial = packageReport.Get(1);
        }
    }
}
