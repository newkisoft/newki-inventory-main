using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using Microsoft.AspNetCore.Authorization;
using inventory.Models.DashboardViewModels;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Dashboard.RoleName)]
    [Route("api/Dashboard")]
    public class DashboardController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const int MARGIN_DAYS = 28;
        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Invoice
        [HttpGet("GetInvoices")]
        public IActionResult GetInvoices()
        {
            var Items = _context.Invoice.Where(w => w.Customer.CustomerId != 67).ToList()
                    .OrderBy(p => p.InvoiceDate)
                    .GroupBy(p => $"{p.InvoiceDate.Year}/{ p.InvoiceDate.Month }")
                    .Select(p=> new GroupReport<Invoice>(){Key=p.Key,Elements= p.ToList()});
            return Ok(Items);
        }
        [HttpGet("GetExpenses")]
        public IActionResult GetExpenses()
        {
            var Items = _context.Bill.ToList()
                .OrderBy(p => p.BillDate)
                .GroupBy(p =>$"{ p.BillDate.Year}/{p.BillDate.Month}")
                .Select(p=> new GroupReport<Bill>(){Key=p.Key,Elements= p.ToList()});
            return Ok(Items);
        }

        [HttpGet("GetInventoryDTY")]
        public IActionResult GetInventoryDTY()
        {
            var Items = _context.Pallet.Where(p => p.Sold == false && p.YarnType.Contains("DTY"))
                                .ToList()
                                .GroupBy(p => p.ColorCode)
                                .Select(p=> new GroupReport<Pallet>(){Key=p.Key,Elements= p.ToList()});
            return Ok(Items);
        }
        
        [HttpGet("GetInventoryFDY")]
        public IActionResult GetInventoryFDY()
        {
            var Items = _context.Pallet.Where(p => p.Sold == false && p.YarnType.Contains("FDY"))
                            .ToList()
                            .GroupBy(p => p.ColorCode)
                            .Select(p=> new GroupReport<Pallet>(){Key=p.Key,Elements= p.ToList()});

            return Ok(Items);
        }

        [HttpGet("SellRatio")]
        public IActionResult SellRation()
        {
           var colorsSellingRatio = CalculateRatio();
            return Ok(colorsSellingRatio.OrderByDescending(p=>p.Weight));
        }


        [HttpGet("InventoryLowAlert")]
        public IActionResult InventoryLowAlert()
        {
            var colorsSellingRatio = CalculateRatio().OrderByDescending(p=>p.Weight);
            var alerts = new List<ColorSellingRatio>();

            foreach(var color in colorsSellingRatio)
            {
                var weightPallet = _context.Pallet
                .Where(p=>p.ColorCode == color.ColorCode && p.Intermingle == color.Intermingle  
                    && p.Denier == color.Denier && p.Filament == color.Filament
                    && p.BobbinSize == color.BobbinSize && !p.Sold).Sum(p=>p.RemainWeight);
                if(weightPallet <= color.Weight*MARGIN_DAYS )
                {
                    alerts.Add(color);
                }
            }

            return Ok(alerts);
        }

        private List<ColorSellingRatio> CalculateRatio()
        {
             var fiveWeeksEarlier = DateTimeOffset.Now.AddDays(-MARGIN_DAYS);
            var colorsSoldWeight = new List<ColorSellingRatio>();            
            var boxInvoices = _context.InvoiceBox.Include(p => p.Box).Where(p => p.Invoice.InvoiceDate > fiveWeeksEarlier);
            var palletInvoices = _context.InvoicePallet.Include(p => p.Pallet)
            .Where(p => p.Invoice.InvoiceDate > fiveWeeksEarlier);

            foreach (var invoiceBox in boxInvoices)
            {
                var colorCode = invoiceBox.Box.ColorCode;
                if (!colorsSoldWeight.Any(p => p.ColorCode == colorCode))
                {
                    colorsSoldWeight.Add( new ColorSellingRatio(colorCode,invoiceBox.Box.BobbinSize, 
                    invoiceBox.Weight,invoiceBox.Box.Intermingle,
                    invoiceBox.Box.Denier,invoiceBox.Box.Filament));
                }
                else
                {
                    colorsSoldWeight.FirstOrDefault(p =>p.ColorCode == colorCode).Weight += invoiceBox.Weight;
                }
            }

            foreach (var invoicePallet in palletInvoices)
            {
               
                var colorCode = invoicePallet.Pallet.ColorCode;
                if (!colorsSoldWeight.Any(p => p.ColorCode == colorCode))
                {
                    colorsSoldWeight.Add( new ColorSellingRatio(colorCode,invoicePallet.Pallet.BobbinSize, 
                    invoicePallet.Weight,invoicePallet.Pallet.Intermingle,
                    invoicePallet.Pallet.Denier,invoicePallet.Pallet.Filament));
                }
                else
                {
                    colorsSoldWeight.FirstOrDefault(p =>p.ColorCode == colorCode).Weight += invoicePallet.Weight;
                }
            }

            foreach(var soldWeight in colorsSoldWeight)
            {
                soldWeight.Weight = soldWeight.Weight/MARGIN_DAYS;                 
            }
            return colorsSoldWeight;

        }

        public class ColorSellingRatio
        {
            public ColorSellingRatio(string colorCode,string bobbinSize,double weight,string intermingle,int denier, int filament)
            {
                ColorCode = colorCode;
                BobbinSize = bobbinSize;
                Weight = weight;
                Intermingle = intermingle;
                Denier = denier;
                Filament = filament;

            }
            public string ColorCode{get;set;}
            public string BobbinSize{get;set;}
            public string Intermingle{get;set;}
            public int Denier{get;set;}
            public int Filament{get;set;}
            public double Weight{get;set;}
        }


    }
}