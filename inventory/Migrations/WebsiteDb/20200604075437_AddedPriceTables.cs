using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace inventory.Migrations.WebsiteDb
{
    public partial class AddedPriceTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BcfPrice",
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
                    table.PrimaryKey("PK_BcfPrice", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BcfPriceArchive",
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
                    table.PrimaryKey("PK_BcfPriceArchive", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShwPrice",
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
                    table.PrimaryKey("PK_ShwPrice", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShwPriceArchive",
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
                    table.PrimaryKey("PK_ShwPriceArchive", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SpandexPrice",
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
                    Price = table.Column<string>(nullable: true),
                    ElasticNumber = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpandexPrice", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SpandexPriceArchive",
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
                    Price = table.Column<string>(nullable: true),
                    ElasticNumber = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpandexPriceArchive", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TfoPrice",
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
                    Price = table.Column<string>(nullable: true),
                    Twist = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TfoPrice", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TfoPriceArchive",
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
                    Price = table.Column<string>(nullable: true),
                    Twist = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TfoPriceArchive", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BcfPrice");

            migrationBuilder.DropTable(
                name: "BcfPriceArchive");

            migrationBuilder.DropTable(
                name: "ShwPrice");

            migrationBuilder.DropTable(
                name: "ShwPriceArchive");

            migrationBuilder.DropTable(
                name: "SpandexPrice");

            migrationBuilder.DropTable(
                name: "SpandexPriceArchive");

            migrationBuilder.DropTable(
                name: "TfoPrice");

            migrationBuilder.DropTable(
                name: "TfoPriceArchive");
        }
    }
}
