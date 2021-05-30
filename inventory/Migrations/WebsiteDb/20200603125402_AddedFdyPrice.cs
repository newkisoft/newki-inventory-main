using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace inventory.Migrations.WebsiteDb
{
    public partial class AddedFdyPrice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FdyPrice",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestNumber = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Lustre = table.Column<string>(nullable: true),
                    Intermingle = table.Column<string>(nullable: true),
                    Color = table.Column<string>(nullable: true),
                    ColorCode = table.Column<string>(nullable: true),
                    Price = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FdyPrice", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FdyPriceArchive",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestNumber = table.Column<string>(nullable: true),
                    InsertDate = table.Column<DateTimeOffset>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Lustre = table.Column<string>(nullable: true),
                    Intermingle = table.Column<string>(nullable: true),
                    Color = table.Column<string>(nullable: true),
                    ColorCode = table.Column<string>(nullable: true),
                    Price = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FdyPriceArchive", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FdyPrice");

            migrationBuilder.DropTable(
                name: "FdyPriceArchive");
        }
    }
}
