using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Authorization;
using System;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Pallet.RoleName)]
    [Route("api/WeightCorrection")]
    public class WeightCorrectionController : Controller
    {
        private readonly ApplicationDbContext _context;

        public WeightCorrectionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Box
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var errorList = new List<Pallet>();
            List<InvoiceBox> invoiceBoxes = await _context.InvoiceBox.Include(p => p.Box).ToListAsync();
            List<InvoicePallet> invoicePallets = await _context.InvoicePallet.Include(p => p.Pallet).ToListAsync();
            var boxPallets = new Dictionary<int, double>();
            foreach (var invoiceBox in invoiceBoxes)
            {
                if (!boxPallets.Keys.Contains(invoiceBox.Box.PalletId))
                {
                    boxPallets.Add(invoiceBox.Box.PalletId, 0);
                }
                boxPallets[invoiceBox.Box.PalletId] += invoiceBox.Weight;
            }

            foreach (var boxPallet in boxPallets)
            {              
                var pallet = _context.Pallet.FirstOrDefault(p => p.PalletId == boxPallet.Key);
                if (pallet.Weight == Math.Round(boxPallet.Value,3) && pallet.Sold == false)
                {
                    errorList.Add(pallet);
                    pallet.RemainWeight = 0;
                    pallet.Sold = true;
                    _context.SaveChanges();
                }
                else
                {
                    var remainingWeight = Math.Round(pallet.Weight - boxPallet.Value, 3);
                    if (remainingWeight != pallet.RemainWeight)
                    {
                        pallet.RemainWeight = remainingWeight;
                        _context.SaveChanges();
                        errorList.Add(pallet);
                    }
                }

            }

            var palletTotalSold = new Dictionary<int, double>();
            foreach (var invoicePallet in invoicePallets)
            {
                if (!palletTotalSold.Keys.Contains(invoicePallet.PalletId))
                {
                    palletTotalSold.Add(invoicePallet.PalletId, 0);
                }
                palletTotalSold[invoicePallet.PalletId] += invoicePallet.Weight;
            }

            foreach (var palletSoldWeight in palletTotalSold)
            {

                var boxPalletWeight = 0.0;
                if (boxPallets.ContainsKey(palletSoldWeight.Key))
                {
                    boxPalletWeight = boxPallets[palletSoldWeight.Key];
                }
                var pallet = _context.Pallet.FirstOrDefault(p => p.PalletId == palletSoldWeight.Key);
                if (pallet.Weight == Math.Round(palletSoldWeight.Value,3) && pallet.Sold == false)
                {
                    errorList.Add(pallet);
                    pallet.RemainWeight = 0;
                    pallet.Sold = true;
                    _context.SaveChanges();
                }
                else
                {
                    var remainingWeight = Math.Round(pallet.Weight - palletSoldWeight.Value - boxPalletWeight, 3);
                    if (remainingWeight != pallet.RemainWeight)
                    {
                        pallet.RemainWeight = remainingWeight;
                        _context.SaveChanges();
                        errorList.Add(pallet);
                    }
                }

            }

            return Ok(errorList);

        }

        [HttpPut("[action]")]
        public IActionResult Update()
        {
            return Ok();
        }


    }
}