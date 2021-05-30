using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;
using inventory.Services;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Pallet.RoleName)]
    [Route("api/ExportPallet")]
    public class ExportPalletController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly WebsiteDbContext _websiteDbContext;
        private readonly IDemo _demo;

        public ExportPalletController(ApplicationDbContext context,
             WebsiteDbContext websiteDbContext,
             IDemo demo)
        {
            _context = context;
            _websiteDbContext = websiteDbContext;
            _demo = demo;
        }

        // GET: api/Pallet
        [HttpGet]
        public IActionResult Export()
        {
            if (_demo.IsDemo)
                return Ok();
            var pallets = _context.Pallet.Where(p => p.Sold == false).ToList();

            var Items = pallets.Select(w => new WebsitePallet
            {
                Color = w.Color,
                ColorCode = w.ColorCode,
                BobbinSize = w.BobbinSize,
                Denier = w.Denier.ToString(),
                Filament = w.Filament.ToString(),
                Intermingle = w.Intermingle,
                YarnType = w.YarnType
            });
            var disctinctColors = new List<WebsitePallet>();

            foreach (var pallet in _websiteDbContext.WebsitePallet)
            {
                _websiteDbContext.WebsitePallet.Remove(pallet);
            }
            _websiteDbContext.SaveChanges();

            foreach (var item in Items)
            {
                if (!disctinctColors.Any(p => p.ColorCode == item.ColorCode
                     && p.BobbinSize == item.BobbinSize))
                {
                    disctinctColors.Add(item);
                }
            }

            foreach (var websitePallet in disctinctColors)
            {
                _websiteDbContext.WebsitePallet.Add(websitePallet);
            }

            _websiteDbContext.SaveChanges();

            return Ok(Items);
        }


        // GET: api/Pallet
        [HttpGet("ExportForOnlineSale")]
        public IActionResult ExportForOnlineSale()
        {
            if (_demo.IsDemo)
                return Ok();

            var pallets = _context.Pallet.Where(p => p.IsOnlineProduct).ToList();
            foreach (var pallet in pallets)
            {
                var palletKey = $"pallet-{pallet.PalletId}";
                var existingPallet = _websiteDbContext.OnlineProduct.FirstOrDefault(p => p.Key == palletKey);
                if (existingPallet == null)
                {
                    var websiteProduct = new OnlineProduct();
                    websiteProduct.Title = pallet.Title;
                    websiteProduct.ThumbnailImage = pallet.ThumbnailImage;
                    websiteProduct.Image = pallet.Image;
                    websiteProduct.Key = palletKey;
                    websiteProduct.Price = pallet.Price;
                    websiteProduct.Description = pallet.Details;
                    websiteProduct.NumberOfProducts = pallet.RemainingItems;
                    _websiteDbContext.OnlineProduct.Add(websiteProduct);
                }
                else
                {
                    if (!pallet.Sold)
                    {
                        existingPallet.Image = pallet.Image;
                        existingPallet.ThumbnailImage = pallet.ThumbnailImage;
                        existingPallet.Price = pallet.Price;
                        existingPallet.Title = pallet.Title;
                        existingPallet.Description = pallet.Details;
                    }
                    else
                    {
                        _websiteDbContext.OnlineProduct.Remove(existingPallet);
                    }
                }
            }
            _websiteDbContext.SaveChanges();
            return Ok();
        }
    }
}