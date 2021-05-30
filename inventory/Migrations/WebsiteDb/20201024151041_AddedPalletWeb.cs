using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace inventory.Migrations.WebsiteDb
{
    public partial class AddedPalletWeb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          
            migrationBuilder.CreateTable(
                name: "WebsitePallet",
                columns: table => new
                {
                    PalletId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PalletGeneratedNumber = table.Column<string>(nullable: true),
                    YarnType = table.Column<string>(nullable: true),
                    Denier = table.Column<string>(nullable: true),
                    Filament = table.Column<string>(nullable: true),
                    Intermingle = table.Column<string>(nullable: true),
                    Color = table.Column<string>(nullable: true),
                    ColorCode = table.Column<string>(nullable: true),
                    BobbinSize = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebsitePallet", x => x.PalletId);
                });

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            

            migrationBuilder.DropTable(
                name: "WebsitePallet");

        }
    }
}
