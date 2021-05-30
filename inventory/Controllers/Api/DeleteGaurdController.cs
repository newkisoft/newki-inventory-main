using System.Linq;
using Microsoft.AspNetCore.Mvc;
using inventory.Data;
using Microsoft.AspNetCore.Authorization;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/DeleteGaurd")]
    public class DeleteGaurdController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DeleteGaurdController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpGet("CheckPallet/{palletId}")]
        public IActionResult CheckPallet(int palletId)
        {
            var hasInvoice = _context.InvoicePallet.Any(p => p.PalletId == palletId);
            var hasBox = _context.Box.Any(p=>p.PalletId ==palletId);
            return Ok(hasInvoice || hasBox);
        }
        
        [HttpGet("CheckBox/{boxId}")]
        public IActionResult CheckBox(int boxId)
        {
            var hasInvoice = _context.InvoiceBox.Any(p => p.BoxId == boxId);            
            return Ok(hasInvoice);
        }
    }

}