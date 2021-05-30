using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace inventory.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Agent",
                columns: table => new
                {
                    AgentId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: true),
                    City = table.Column<string>(type: "text", nullable: true),
                    ZipCode = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    MobilePhone = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Website = table.Column<string>(type: "text", nullable: true),
                    Vergi = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agent", x => x.AgentId);
                });

            migrationBuilder.CreateTable(
                name: "AlertDataView",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    AlertType = table.Column<string>(type: "text", nullable: true),
                    Data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlertDataView", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BillBankDataView",
                columns: table => new
                {
                    BillId = table.Column<int>(type: "integer", nullable: false),
                    Data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillBankDataView", x => x.BillId);
                });

            migrationBuilder.CreateTable(
                name: "BillDataView",
                columns: table => new
                {
                    BillId = table.Column<int>(type: "integer", nullable: false),
                    Data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillDataView", x => x.BillId);
                });

            migrationBuilder.CreateTable(
                name: "BoxDataView",
                columns: table => new
                {
                    BoxId = table.Column<int>(type: "integer", nullable: false),
                    Data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoxDataView", x => x.BoxId);
                });

            migrationBuilder.CreateTable(
                name: "BoxFilter",
                columns: table => new
                {
                    BoxFilterId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ColumnName = table.Column<string>(type: "text", nullable: true),
                    Keywords = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoxFilter", x => x.BoxFilterId);
                });

            migrationBuilder.CreateTable(
                name: "ContainerPlan",
                columns: table => new
                {
                    ContainerPlanId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    EstimateArrivalDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContainerPlan", x => x.ContainerPlanId);
                });

            migrationBuilder.CreateTable(
                name: "Currency",
                columns: table => new
                {
                    CurrencyId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CurrencyName = table.Column<string>(type: "text", nullable: false),
                    CurrencyCode = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currency", x => x.CurrencyId);
                });

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    CustomerId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CustomerName = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: true),
                    City = table.Column<string>(type: "text", nullable: true),
                    ZipCode = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    MobilePhone = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Gmail = table.Column<string>(type: "text", nullable: true),
                    Website = table.Column<string>(type: "text", nullable: true),
                    Vergi = table.Column<string>(type: "text", nullable: true),
                    Rate = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer", x => x.CustomerId);
                });

            migrationBuilder.CreateTable(
                name: "CustomerDataView",
                columns: table => new
                {
                    CustomerId = table.Column<int>(type: "integer", nullable: false),
                    Data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerDataView", x => x.CustomerId);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseLogs",
                columns: table => new
                {
                    DatabaseLogId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EntryDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseLogs", x => x.DatabaseLogId);
                });

            migrationBuilder.CreateTable(
                name: "DocumentFile",
                columns: table => new
                {
                    DocumentFileId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FileName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentFile", x => x.DocumentFileId);
                });

            migrationBuilder.CreateTable(
                name: "GoodsContainer",
                columns: table => new
                {
                    GoodsContainerId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    ImportDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ReleaseDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GoodsContainer", x => x.GoodsContainerId);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceDataView",
                columns: table => new
                {
                    InvoiceId = table.Column<int>(type: "integer", nullable: false),
                    Data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceDataView", x => x.InvoiceId);
                });

            migrationBuilder.CreateTable(
                name: "Pallet",
                columns: table => new
                {
                    PalletId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PalletNumber = table.Column<string>(type: "text", nullable: true),
                    Barcode = table.Column<string>(type: "text", nullable: true),
                    YarnType = table.Column<string>(type: "text", nullable: true),
                    Denier = table.Column<int>(type: "integer", nullable: false),
                    Filament = table.Column<int>(type: "integer", nullable: false),
                    Lustre = table.Column<string>(type: "text", nullable: true),
                    Intermingle = table.Column<string>(type: "text", nullable: true),
                    Color = table.Column<string>(type: "text", nullable: true),
                    ColorCode = table.Column<string>(type: "text", nullable: true),
                    BobbinSize = table.Column<string>(type: "text", nullable: true),
                    PalletName = table.Column<string>(type: "text", nullable: true),
                    Weight = table.Column<double>(type: "double precision", nullable: false),
                    Price = table.Column<double>(type: "double precision", nullable: false),
                    RemainWeight = table.Column<double>(type: "double precision", nullable: false),
                    Sold = table.Column<bool>(type: "boolean", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: true),
                    Lot = table.Column<string>(type: "text", nullable: true),
                    Warehouse = table.Column<string>(type: "text", nullable: true),
                    Details = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Image = table.Column<string>(type: "text", nullable: true),
                    ThumbnailImage = table.Column<string>(type: "text", nullable: true),
                    NumberOfItems = table.Column<int>(type: "integer", nullable: false),
                    RemainingItems = table.Column<int>(type: "integer", nullable: false),
                    IsOnlineProduct = table.Column<bool>(type: "boolean", nullable: false),
                    IsDelivered = table.Column<bool>(type: "boolean", nullable: false),
                    DeliveryDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pallet", x => x.PalletId);
                });

            migrationBuilder.CreateTable(
                name: "PalletDataView",
                columns: table => new
                {
                    PalletId = table.Column<int>(type: "integer", nullable: false),
                    Data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PalletDataView", x => x.PalletId);
                });

            migrationBuilder.CreateTable(
                name: "PalletFilter",
                columns: table => new
                {
                    PalletFilterId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ColumnName = table.Column<string>(type: "text", nullable: true),
                    Keywords = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PalletFilter", x => x.PalletFilterId);
                });

            migrationBuilder.CreateTable(
                name: "PalletPlan",
                columns: table => new
                {
                    PalletPlanId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Details = table.Column<string>(type: "text", nullable: true),
                    Weight = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PalletPlan", x => x.PalletPlanId);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    ProductId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Image = table.Column<string>(type: "text", nullable: true),
                    ThumbnailImage = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.ProductId);
                });

            migrationBuilder.CreateTable(
                name: "ProformaItem",
                columns: table => new
                {
                    ProformaItemId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProformaItem", x => x.ProformaItemId);
                });

            migrationBuilder.CreateTable(
                name: "RequestStatus",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Setting",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Key = table.Column<string>(type: "text", nullable: true),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Setting", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserProfile",
                columns: table => new
                {
                    UserProfileId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Password = table.Column<string>(type: "text", nullable: true),
                    ConfirmPassword = table.Column<string>(type: "text", nullable: true),
                    OldPassword = table.Column<string>(type: "text", nullable: true),
                    ProfilePicture = table.Column<string>(type: "text", nullable: true),
                    ApplicationUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfile", x => x.UserProfileId);
                });

            migrationBuilder.CreateTable(
                name: "Vendor",
                columns: table => new
                {
                    VendorId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    VendorName = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: true),
                    City = table.Column<string>(type: "text", nullable: true),
                    ZipCode = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    MobilePhone = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Website = table.Column<string>(type: "text", nullable: true),
                    Vergi = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor", x => x.VendorId);
                });

            migrationBuilder.CreateTable(
                name: "VendorDataView",
                columns: table => new
                {
                    VendorId = table.Column<int>(type: "integer", nullable: false),
                    Data = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VendorDataView", x => x.VendorId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    RoleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AgentCustomer",
                columns: table => new
                {
                    CustomerId = table.Column<int>(type: "integer", nullable: false),
                    AgentId = table.Column<int>(type: "integer", nullable: false),
                    Rate = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgentCustomer", x => new { x.CustomerId, x.AgentId });
                    table.ForeignKey(
                        name: "FK_AgentCustomer_Agent_AgentId",
                        column: x => x.AgentId,
                        principalTable: "Agent",
                        principalColumn: "AgentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AgentCustomer_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Invoice",
                columns: table => new
                {
                    InvoiceId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InvoiceDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    InvoiceDueDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CustomerId = table.Column<int>(type: "integer", nullable: true),
                    TotalUsd = table.Column<double>(type: "double precision", nullable: false),
                    Tax = table.Column<double>(type: "double precision", nullable: false),
                    Kdv = table.Column<double>(type: "double precision", nullable: false),
                    ExchangeRate = table.Column<double>(type: "double precision", nullable: false),
                    StateInvoiceNumber = table.Column<int>(type: "integer", nullable: false),
                    Discount = table.Column<double>(type: "double precision", nullable: false),
                    Paid = table.Column<double>(type: "double precision", nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: true),
                    OrderId = table.Column<int>(type: "integer", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: true),
                    DriverName = table.Column<string>(type: "text", nullable: true),
                    DriverRegistrationNumber = table.Column<string>(type: "text", nullable: true),
                    HasOfficialInvoice = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoice", x => x.InvoiceId);
                    table.ForeignKey(
                        name: "FK_Invoice_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OrderDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CustomerId = table.Column<int>(type: "integer", nullable: true),
                    Comment = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_Order_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Proforma",
                columns: table => new
                {
                    ProformaId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProformaDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ProformaDueDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CustomerId = table.Column<int>(type: "integer", nullable: true),
                    TotalUsd = table.Column<double>(type: "double precision", nullable: false),
                    Tax = table.Column<double>(type: "double precision", nullable: false),
                    Kdv = table.Column<double>(type: "double precision", nullable: false),
                    ExchangeRate = table.Column<double>(type: "double precision", nullable: false),
                    Discount = table.Column<double>(type: "double precision", nullable: false),
                    Paid = table.Column<double>(type: "double precision", nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: true),
                    Comment = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Proforma", x => x.ProformaId);
                    table.ForeignKey(
                        name: "FK_Proforma_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ContainerPlanDocumentFile",
                columns: table => new
                {
                    DocumentFileId = table.Column<int>(type: "integer", nullable: false),
                    ContainerPlanId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContainerPlanDocumentFile", x => new { x.ContainerPlanId, x.DocumentFileId });
                    table.ForeignKey(
                        name: "FK_ContainerPlanDocumentFile_ContainerPlan_ContainerPlanId",
                        column: x => x.ContainerPlanId,
                        principalTable: "ContainerPlan",
                        principalColumn: "ContainerPlanId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContainerPlanDocumentFile_DocumentFile_DocumentFileId",
                        column: x => x.DocumentFileId,
                        principalTable: "DocumentFile",
                        principalColumn: "DocumentFileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GoodsContainerDocumentFile",
                columns: table => new
                {
                    DocumentFileId = table.Column<int>(type: "integer", nullable: false),
                    GoodsContainerId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GoodsContainerDocumentFile", x => new { x.GoodsContainerId, x.DocumentFileId });
                    table.ForeignKey(
                        name: "FK_GoodsContainerDocumentFile_DocumentFile_DocumentFileId",
                        column: x => x.DocumentFileId,
                        principalTable: "DocumentFile",
                        principalColumn: "DocumentFileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GoodsContainerDocumentFile_GoodsContainer_GoodsContainerId",
                        column: x => x.GoodsContainerId,
                        principalTable: "GoodsContainer",
                        principalColumn: "GoodsContainerId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Box",
                columns: table => new
                {
                    BoxId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PalletId = table.Column<int>(type: "integer", nullable: false),
                    Barcode = table.Column<string>(type: "text", nullable: true),
                    YarnType = table.Column<string>(type: "text", nullable: true),
                    Denier = table.Column<int>(type: "integer", nullable: false),
                    Filament = table.Column<int>(type: "integer", nullable: false),
                    Intermingle = table.Column<string>(type: "text", nullable: true),
                    Color = table.Column<string>(type: "text", nullable: true),
                    ColorCode = table.Column<string>(type: "text", nullable: true),
                    BobbinSize = table.Column<string>(type: "text", nullable: true),
                    Weight = table.Column<double>(type: "double precision", nullable: false),
                    Price = table.Column<double>(type: "double precision", nullable: false),
                    RemainWeight = table.Column<double>(type: "double precision", nullable: false),
                    Sold = table.Column<bool>(type: "boolean", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: true),
                    IsDelivered = table.Column<bool>(type: "boolean", nullable: false),
                    DeliveryDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Box", x => x.BoxId);
                    table.ForeignKey(
                        name: "FK_Box_Pallet_PalletId",
                        column: x => x.PalletId,
                        principalTable: "Pallet",
                        principalColumn: "PalletId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GoodsContainerPallet",
                columns: table => new
                {
                    GoodsContainerId = table.Column<int>(type: "integer", nullable: false),
                    PalletId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GoodsContainerPallet", x => new { x.GoodsContainerId, x.PalletId });
                    table.ForeignKey(
                        name: "FK_GoodsContainerPallet_GoodsContainer_GoodsContainerId",
                        column: x => x.GoodsContainerId,
                        principalTable: "GoodsContainer",
                        principalColumn: "GoodsContainerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GoodsContainerPallet_Pallet_PalletId",
                        column: x => x.PalletId,
                        principalTable: "Pallet",
                        principalColumn: "PalletId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContainerPlanPalletPlan",
                columns: table => new
                {
                    PalletPlanId = table.Column<int>(type: "integer", nullable: false),
                    ContainerPlanId = table.Column<int>(type: "integer", nullable: false),
                    Customer = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContainerPlanPalletPlan", x => new { x.ContainerPlanId, x.PalletPlanId });
                    table.ForeignKey(
                        name: "FK_ContainerPlanPalletPlan_ContainerPlan_ContainerPlanId",
                        column: x => x.ContainerPlanId,
                        principalTable: "ContainerPlan",
                        principalColumn: "ContainerPlanId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContainerPlanPalletPlan_PalletPlan_PalletPlanId",
                        column: x => x.PalletPlanId,
                        principalTable: "PalletPlan",
                        principalColumn: "PalletPlanId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bill",
                columns: table => new
                {
                    BillId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BillName = table.Column<string>(type: "text", nullable: true),
                    VendorInvoiceNumber = table.Column<string>(type: "text", nullable: true),
                    BillDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    BillDueDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Amount = table.Column<double>(type: "double precision", nullable: false),
                    UsdAmount = table.Column<double>(type: "double precision", nullable: false),
                    EuroAmount = table.Column<double>(type: "double precision", nullable: false),
                    Paid = table.Column<double>(type: "double precision", nullable: false),
                    KDV = table.Column<double>(type: "double precision", nullable: false),
                    VendorId = table.Column<int>(type: "integer", nullable: true),
                    ExchangeRate = table.Column<double>(type: "double precision", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bill", x => x.BillId);
                    table.ForeignKey(
                        name: "FK_Bill_Vendor_VendorId",
                        column: x => x.VendorId,
                        principalTable: "Vendor",
                        principalColumn: "VendorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Leave",
                columns: table => new
                {
                    LeaveId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LeaveStartDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LeaveEndDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    VendorId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Leave", x => x.LeaveId);
                    table.ForeignKey(
                        name: "FK_Leave_Vendor_VendorId",
                        column: x => x.VendorId,
                        principalTable: "Vendor",
                        principalColumn: "VendorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceDocumentFile",
                columns: table => new
                {
                    DocumentFileId = table.Column<int>(type: "integer", nullable: false),
                    InvoiceId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceDocumentFile", x => new { x.InvoiceId, x.DocumentFileId });
                    table.ForeignKey(
                        name: "FK_InvoiceDocumentFile_DocumentFile_DocumentFileId",
                        column: x => x.DocumentFileId,
                        principalTable: "DocumentFile",
                        principalColumn: "DocumentFileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoiceDocumentFile_Invoice_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoice",
                        principalColumn: "InvoiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvoicePallet",
                columns: table => new
                {
                    InvoiceId = table.Column<int>(type: "integer", nullable: false),
                    PalletId = table.Column<int>(type: "integer", nullable: false),
                    Weight = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoicePallet", x => new { x.InvoiceId, x.PalletId });
                    table.ForeignKey(
                        name: "FK_InvoicePallet_Invoice_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoice",
                        principalColumn: "InvoiceId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoicePallet_Pallet_PalletId",
                        column: x => x.PalletId,
                        principalTable: "Pallet",
                        principalColumn: "PalletId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvoicePayment",
                columns: table => new
                {
                    InvoicePaymentId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InvoiceId = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<double>(type: "double precision", nullable: false),
                    ExchangeRate = table.Column<double>(type: "double precision", nullable: false),
                    PaymentDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoicePayment", x => x.InvoicePaymentId);
                    table.ForeignKey(
                        name: "FK_InvoicePayment_Invoice_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoice",
                        principalColumn: "InvoiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderDocumentFile",
                columns: table => new
                {
                    DocumentFileId = table.Column<int>(type: "integer", nullable: false),
                    OrderId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDocumentFile", x => new { x.OrderId, x.DocumentFileId });
                    table.ForeignKey(
                        name: "FK_OrderDocumentFile_DocumentFile_DocumentFileId",
                        column: x => x.DocumentFileId,
                        principalTable: "DocumentFile",
                        principalColumn: "DocumentFileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderDocumentFile_Order_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Order",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProformaDocumentFile",
                columns: table => new
                {
                    DocumentFileId = table.Column<int>(type: "integer", nullable: false),
                    ProformaId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProformaDocumentFile", x => new { x.ProformaId, x.DocumentFileId });
                    table.ForeignKey(
                        name: "FK_ProformaDocumentFile_DocumentFile_DocumentFileId",
                        column: x => x.DocumentFileId,
                        principalTable: "DocumentFile",
                        principalColumn: "DocumentFileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProformaDocumentFile_Proforma_ProformaId",
                        column: x => x.ProformaId,
                        principalTable: "Proforma",
                        principalColumn: "ProformaId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProformaProformaItem",
                columns: table => new
                {
                    ProformaId = table.Column<int>(type: "integer", nullable: false),
                    ProformaItemId = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<double>(type: "double precision", nullable: false),
                    Weight = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProformaProformaItem", x => new { x.ProformaId, x.ProformaItemId });
                    table.ForeignKey(
                        name: "FK_ProformaProformaItem_Proforma_ProformaId",
                        column: x => x.ProformaId,
                        principalTable: "Proforma",
                        principalColumn: "ProformaId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProformaProformaItem_ProformaItem_ProformaItemId",
                        column: x => x.ProformaItemId,
                        principalTable: "ProformaItem",
                        principalColumn: "ProformaItemId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceBox",
                columns: table => new
                {
                    BoxId = table.Column<int>(type: "integer", nullable: false),
                    InvoiceId = table.Column<int>(type: "integer", nullable: false),
                    Weight = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceBox", x => new { x.InvoiceId, x.BoxId });
                    table.ForeignKey(
                        name: "FK_InvoiceBox_Box_BoxId",
                        column: x => x.BoxId,
                        principalTable: "Box",
                        principalColumn: "BoxId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoiceBox_Invoice_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoice",
                        principalColumn: "InvoiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BillDocumentFile",
                columns: table => new
                {
                    DocumentFileId = table.Column<int>(type: "integer", nullable: false),
                    BillId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillDocumentFile", x => new { x.BillId, x.DocumentFileId });
                    table.ForeignKey(
                        name: "FK_BillDocumentFile_Bill_BillId",
                        column: x => x.BillId,
                        principalTable: "Bill",
                        principalColumn: "BillId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BillDocumentFile_DocumentFile_DocumentFileId",
                        column: x => x.DocumentFileId,
                        principalTable: "DocumentFile",
                        principalColumn: "DocumentFileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AgentCustomer_AgentId",
                table: "AgentCustomer",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bill_VendorId",
                table: "Bill",
                column: "VendorId");

            migrationBuilder.CreateIndex(
                name: "IX_BillDocumentFile_DocumentFileId",
                table: "BillDocumentFile",
                column: "DocumentFileId");

            migrationBuilder.CreateIndex(
                name: "IX_Box_PalletId",
                table: "Box",
                column: "PalletId");

            migrationBuilder.CreateIndex(
                name: "IX_ContainerPlanDocumentFile_DocumentFileId",
                table: "ContainerPlanDocumentFile",
                column: "DocumentFileId");

            migrationBuilder.CreateIndex(
                name: "IX_ContainerPlanPalletPlan_PalletPlanId",
                table: "ContainerPlanPalletPlan",
                column: "PalletPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_GoodsContainerDocumentFile_DocumentFileId",
                table: "GoodsContainerDocumentFile",
                column: "DocumentFileId");

            migrationBuilder.CreateIndex(
                name: "IX_GoodsContainerPallet_PalletId",
                table: "GoodsContainerPallet",
                column: "PalletId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_CustomerId",
                table: "Invoice",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceBox_BoxId",
                table: "InvoiceBox",
                column: "BoxId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceDocumentFile_DocumentFileId",
                table: "InvoiceDocumentFile",
                column: "DocumentFileId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePallet_PalletId",
                table: "InvoicePallet",
                column: "PalletId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoicePayment_InvoiceId",
                table: "InvoicePayment",
                column: "InvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Leave_VendorId",
                table: "Leave",
                column: "VendorId");

            migrationBuilder.CreateIndex(
                name: "IX_Order_CustomerId",
                table: "Order",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDocumentFile_DocumentFileId",
                table: "OrderDocumentFile",
                column: "DocumentFileId");

            migrationBuilder.CreateIndex(
                name: "IX_Proforma_CustomerId",
                table: "Proforma",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_ProformaDocumentFile_DocumentFileId",
                table: "ProformaDocumentFile",
                column: "DocumentFileId");

            migrationBuilder.CreateIndex(
                name: "IX_ProformaProformaItem_ProformaItemId",
                table: "ProformaProformaItem",
                column: "ProformaItemId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AgentCustomer");

            migrationBuilder.DropTable(
                name: "AlertDataView");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "BillBankDataView");

            migrationBuilder.DropTable(
                name: "BillDataView");

            migrationBuilder.DropTable(
                name: "BillDocumentFile");

            migrationBuilder.DropTable(
                name: "BoxDataView");

            migrationBuilder.DropTable(
                name: "BoxFilter");

            migrationBuilder.DropTable(
                name: "ContainerPlanDocumentFile");

            migrationBuilder.DropTable(
                name: "ContainerPlanPalletPlan");

            migrationBuilder.DropTable(
                name: "Currency");

            migrationBuilder.DropTable(
                name: "CustomerDataView");

            migrationBuilder.DropTable(
                name: "DatabaseLogs");

            migrationBuilder.DropTable(
                name: "GoodsContainerDocumentFile");

            migrationBuilder.DropTable(
                name: "GoodsContainerPallet");

            migrationBuilder.DropTable(
                name: "InvoiceBox");

            migrationBuilder.DropTable(
                name: "InvoiceDataView");

            migrationBuilder.DropTable(
                name: "InvoiceDocumentFile");

            migrationBuilder.DropTable(
                name: "InvoicePallet");

            migrationBuilder.DropTable(
                name: "InvoicePayment");

            migrationBuilder.DropTable(
                name: "Leave");

            migrationBuilder.DropTable(
                name: "OrderDocumentFile");

            migrationBuilder.DropTable(
                name: "PalletDataView");

            migrationBuilder.DropTable(
                name: "PalletFilter");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "ProformaDocumentFile");

            migrationBuilder.DropTable(
                name: "ProformaProformaItem");

            migrationBuilder.DropTable(
                name: "RequestStatus");

            migrationBuilder.DropTable(
                name: "Setting");

            migrationBuilder.DropTable(
                name: "UserProfile");

            migrationBuilder.DropTable(
                name: "VendorDataView");

            migrationBuilder.DropTable(
                name: "Agent");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Bill");

            migrationBuilder.DropTable(
                name: "ContainerPlan");

            migrationBuilder.DropTable(
                name: "PalletPlan");

            migrationBuilder.DropTable(
                name: "GoodsContainer");

            migrationBuilder.DropTable(
                name: "Box");

            migrationBuilder.DropTable(
                name: "Invoice");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropTable(
                name: "DocumentFile");

            migrationBuilder.DropTable(
                name: "Proforma");

            migrationBuilder.DropTable(
                name: "ProformaItem");

            migrationBuilder.DropTable(
                name: "Vendor");

            migrationBuilder.DropTable(
                name: "Pallet");

            migrationBuilder.DropTable(
                name: "Customer");
        }
    }
}
