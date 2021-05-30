using Microsoft.EntityFrameworkCore.Migrations;

namespace inventory.Migrations.WebsiteDb
{
    public partial class ChangeNameId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OnlineProduct",
                columns: table => new
                {
                    OnlineProductId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Price = table.Column<double>(nullable: false),
                    NumberOfProducts = table.Column<int>(nullable: false),
                    Category = table.Column<string>(nullable: true),
                    Image = table.Column<string>(nullable: true),
                    ThumbnailImage = table.Column<string>(nullable: true),
                    Key = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OnlineProduct", x => x.OnlineProductId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OnlineProduct");
        }
    }
}
