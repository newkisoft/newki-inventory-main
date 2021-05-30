using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using inventory.Services;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;
using System;
using System.Text.Json;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Bill.RoleName)]
    [Route("api/Bill")]
    public class BillController : Controller
    {
        private readonly ApplicationDbContext _context;
        private string _billRequest = "BillRequest";
        private IRabbitMqService _rabbitMqService;
        private readonly ILoggingService _loggingService;

        public BillController(ApplicationDbContext context,
                                ILoggingService loggingService,
                                IRabbitMqService rabbitMqService)
        {
            _context = context;
            _loggingService = loggingService;
            _rabbitMqService = rabbitMqService;
        }

        // GET: api/Bill
        [HttpGet]
        public IActionResult GetBill()
        {
            var bills = new List<Bill>();
            foreach (var bill in _context.BillDataView)
            {
                bills.Add(JsonSerializer.Deserialize<Bill>(bill.Data));
            }
            return Ok(bills.OrderByDescending(p=>p.BillId));
        }


        [HttpGet("GetBill/{start}/{max}")]
        public async Task<IActionResult> GetBill(int start, int max)
        {
            var bills = new List<Bill>();
            foreach (var bill in await _context.BillDataView.OrderByDescending(p=>p.BillId).Skip(start).Take(max).ToListAsync())
            {
                bills.Add(JsonSerializer.Deserialize<Bill>(bill.Data));
            }
            return Ok(bills.OrderByDescending(p=>p.BillId));
        }

        // GET: api/Bill
        [HttpGet("GetBill/{id}")]
        public IActionResult GetBill(int id)
        {
            var billDataView = _context.BillDataView.FirstOrDefault(p => p.BillId == id);
            return Ok(JsonSerializer.Deserialize<Bill>(billDataView.Data));
        }

        [HttpGet("UpdateDataView")]
        public IActionResult UpdateDataView()
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Search.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            _rabbitMqService.Enqueue(_billRequest, inventoryMessage);
            return Ok();
        }

        [HttpGet("Count")]
        public IActionResult Count()
        {
            var Item = _context.BillDataView.Count();
            return Ok(Item);
        }


        [HttpPost("[action]")]
        public IActionResult Insert([FromBody] Bill bill)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Insert.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(bill);
            _rabbitMqService.Enqueue(_billRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.INSERT, inventoryMessage.Message);
            return Ok();
        }

        [HttpPost("[action]")]
        public IActionResult Update([FromBody] Bill bill)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Update.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(bill);
            _rabbitMqService.Enqueue(_billRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.UPDATE, inventoryMessage.Message);
            return Ok();
        }

        [HttpDelete("[action]")]
        public IActionResult Delete(int BillId)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Delete.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(BillId);
            _rabbitMqService.Enqueue(_billRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.DELETE, inventoryMessage.Message);
            return Ok();

        }
    }
}