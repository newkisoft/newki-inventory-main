using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using inventory.Models.SyncfusionViewModels;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.ProformaItem.RoleName)]
    [Route("api/ProformaItem")]
    public class ProformaItemController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProformaItemController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Pallet
        [HttpGet]
        public async Task<IActionResult> GetProformaItems()
        {  
                List<ProformaItem> Items = await _context.ProformaItem.ToListAsync();
                int Count = Items.Count();
                return Ok(new { Items, Count });
           
        } 

          
        [HttpGet("GetProformaItem/{id}")]
        public IActionResult GetProformaItem(int id)
        {  
            var proformaItem = _context.ProformaItem.OrderByDescending(p=>p.ProformaItemId).FirstOrDefault(p=>p.ProformaItemId == id);                
            return Ok(proformaItem);           
        } 

        [HttpPost("[action]")]
        public IActionResult Insert([FromBody]ProformaItem proformaItem)
        {            
            _context.ProformaItem.Add(proformaItem);
            _context.SaveChanges();
            return Ok(proformaItem);
        }

        [HttpPut("[action]")]
        public IActionResult Update([FromBody]ProformaItem proformaItem)
        {        
            _context.ProformaItem.Update((ProformaItem)proformaItem);
            _context.SaveChanges();
            return Ok(proformaItem);
        }

        [HttpDelete("Remove/{id}")]
        public IActionResult Remove(int id)
        {            
            var proformaItem = _context.ProformaItem
                .Where(x => x.ProformaItemId == id)
                .FirstOrDefault();
            _context.ProformaItem.Remove(proformaItem);
            _context.SaveChanges();
            return Ok(proformaItem);
        }
    }
}