using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;
using System;
using inventory.Services;
using System.Text.Json;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Vendor.RoleName)]
    [Route("api/Vendor")]
    public class VendorController : Controller
    {
       private readonly ApplicationDbContext _context;
       private readonly string _vendorRequest ="VendorRequest";
       private readonly IRabbitMqService _rabbitMqService;

        public VendorController(
                                ApplicationDbContext context,
                                ILoggingService loggingService,
                                IRabbitMqService rabbitMqService)
        {
            _context = context;
            _rabbitMqService = rabbitMqService;         
        }

        // GET: api/Vendor
        [HttpGet]
        public async Task<IActionResult> GetVendor()
        {
            var vendors = new List<Vendor>();
            var vendorDataViews = await _context.VendorDataView.OrderByDescending(p=>p.VendorId).ToListAsync();
            foreach(var vendor in vendorDataViews)
            {
                vendors.Add(JsonSerializer.Deserialize<Vendor>(vendor.Data));
            }
            return Ok(vendors);
        }

        [HttpGet("GetVendor/{id}")]
        public IActionResult GetVendor(int id)
        {  
            var vendor = _context.VendorDataView.FirstOrDefault(p=>p.VendorId == id);                
            return Ok(JsonSerializer.Deserialize<Vendor>(vendor.Data));           
        } 


        [HttpPost("[action]")]
        public IActionResult Insert([FromBody]Vendor vendor)
        {            
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Insert.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(vendor);
            _rabbitMqService.Enqueue(_vendorRequest,inventoryMessage);
            return Ok(vendor);
        }

        [HttpPut("[action]")]
        public IActionResult Update([FromBody]Vendor vendor)
        {            
              var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Update.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(vendor);
            _rabbitMqService.Enqueue(_vendorRequest,inventoryMessage);
            return Ok(vendor);
        }

        [HttpDelete("Remove/{id}")]
        public IActionResult Remove(int id)
        {            
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Delete.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(id);
            _rabbitMqService.Enqueue(_vendorRequest,inventoryMessage);
            return Ok();
        }
    }
}