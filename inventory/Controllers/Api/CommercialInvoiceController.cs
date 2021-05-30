using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using inventory.Data;
using inventory.Services;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using newkilibraries;


namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.CommercialInvoice.RoleName)]
    [Route("api/CommercialInvoice")]
    public class CommercialInvoiceController : Controller
    {
        private ILoggingService _loggingService;
        private readonly ApplicationDbContext _context;
        private const string bucketName = "newki";
                private IRabbitMqService _rabbitMqService;
        private readonly string _CommercialInvoiceRequest = "CommercialInvoiceRequest";


        public CommercialInvoiceController(ILoggingService loggingService,
        ApplicationDbContext context,
        IRabbitMqService rabbitMqService)
        {
            _context = context;
            _rabbitMqService = rabbitMqService;
            _loggingService = loggingService;
        }

        // GET: api/CommercialInvoice
        [HttpGet]
        public async Task<IActionResult> GetCommercialInvoices()
        {
            var Items = new List<CommercialInvoice>();
            foreach (var data in _context.CommercialInvoiceDataView.OrderByDescending(p => p.CommercialInvoiceId))
            {
                var CommercialInvoice = JsonSerializer.Deserialize<CommercialInvoice>(data.Data);
                Items.Add(CommercialInvoice);
            }

            return Ok(Items);
        }

        // GET: api/CommercialInvoice
        [HttpGet("GetCommercialInvoice/{id}")]
        public IActionResult GetCommercialInvoice(int id)
        {
            var CommercialInvoice = _context.CommercialInvoiceDataView.FirstOrDefault(p => p.CommercialInvoiceId == id);
            return Ok(JsonSerializer.Deserialize<CommercialInvoice>(CommercialInvoice.Data));
        }

        [HttpPost("[action]")]
        public IActionResult Insert([FromBody] CommercialInvoice CommercialInvoice)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Insert.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(CommercialInvoice);
            _rabbitMqService.Enqueue(_CommercialInvoiceRequest, inventoryMessage);
            var insertRequest = new RequestStatus();
            insertRequest.Status = "Processing";
            insertRequest.Id = inventoryMessage.RequestNumber;
            _context.RequestStatus.Add(insertRequest);
            _loggingService.Log(User.Identity.Name, LogAction.INSERT, inventoryMessage.Message);
            return Ok(inventoryMessage.RequestNumber);
        }


        [HttpPost("CheckCommercialInvoiceInserted")]
        public IActionResult CheckCommercialInvoiceInserted([FromBody] RequestStatus requestStatus)
        {
            var request = _context.RequestStatus.FirstOrDefault(p => p.Id == requestStatus.Id);
            if (request != null && request.Status != "Processing")
            {
                _context.RequestStatus.Remove(request);
                _context.SaveChanges();
                return Ok(request);
            }
            return Ok(new RequestStatus());
        }

        [HttpPost("CheckCommercialInvoiceUpdated")]
        public IActionResult CheckCommercialInvoiceUpdated([FromBody] RequestStatus requestStatus)
        {
            var request = _context.RequestStatus.FirstOrDefault(p => p.Id == requestStatus.Id);
            if (request != null && request.Status != "Processing")
            {
                _context.RequestStatus.Remove(request);
                _context.SaveChanges();
                return Ok(request);
            }
            return Ok(new RequestStatus());
        }

        [HttpPost("[action]")]
        public IActionResult Update([FromBody] CommercialInvoice CommercialInvoice)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Update.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(CommercialInvoice);
            _rabbitMqService.Enqueue(_CommercialInvoiceRequest, inventoryMessage);
            var insertRequest = new RequestStatus();
            insertRequest.Status = "Processing";
            insertRequest.Id = inventoryMessage.RequestNumber;
            _context.RequestStatus.Add(insertRequest);
            _loggingService.Log(User.Identity.Name, LogAction.UPDATE, inventoryMessage.Message);
            return Ok(inventoryMessage.RequestNumber);
        }

        [HttpDelete("[action]")]
        public IActionResult Delete(int CommercialInvoiceId)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Delete.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(CommercialInvoiceId);
            _rabbitMqService.Enqueue(_CommercialInvoiceRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.DELETE, inventoryMessage.Message);
            return Ok();

        }

        [HttpGet("Search/")]
        public IActionResult Search()
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Search.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            _rabbitMqService.Enqueue(_CommercialInvoiceRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.INSERT, inventoryMessage.Message);
            return Ok();
        }

    }
}