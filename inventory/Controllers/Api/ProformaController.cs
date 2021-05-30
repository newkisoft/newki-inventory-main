using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using inventory.Services;
using Microsoft.AspNetCore.Authorization;
using Amazon.S3;
using System.Text.Json;
using Amazon;
using Amazon.Runtime.CredentialManagement;
using newkilibraries;
using System.IO;
using System.Text;


namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Proforma.RoleName)]
    [Route("api/Proforma")]
    public class ProformaController : Controller
    {
        private ILoggingService _loggingService;
        private readonly ApplicationDbContext _context;
        private const string bucketName = "newki";
                private IRabbitMqService _rabbitMqService;
        private readonly string _ProformaRequest = "ProformaRequest";


        public ProformaController(ILoggingService loggingService,
        ApplicationDbContext context,
        IRabbitMqService rabbitMqService)
        {
            _context = context;
            _rabbitMqService = rabbitMqService;
            _loggingService = loggingService;
        }

        // GET: api/Proforma
        [HttpGet]
        public async Task<IActionResult> GetProformas()
        {
            var Items = new List<Proforma>();
            foreach (var data in _context.ProformaDataView.OrderByDescending(p => p.ProformaId))
            {
                var proforma = JsonSerializer.Deserialize<Proforma>(data.Data);
                Items.Add(proforma);
            }

            return Ok(Items);
        }

        // GET: api/Proforma
        [HttpGet("GetProforma/{id}")]
        public IActionResult GetProforma(int id)
        {
            var proforma = _context.ProformaDataView.FirstOrDefault(p => p.ProformaId == id);
            return Ok(JsonSerializer.Deserialize<Proforma>(proforma.Data));
        }

        [HttpPost("[action]")]
        public IActionResult Insert([FromBody] Proforma proforma)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Insert.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(proforma);
            _rabbitMqService.Enqueue(_ProformaRequest, inventoryMessage);
            var insertRequest = new RequestStatus();
            insertRequest.Status = "Processing";
            insertRequest.Id = inventoryMessage.RequestNumber;
            _context.RequestStatus.Add(insertRequest);
            _loggingService.Log(User.Identity.Name, LogAction.INSERT, inventoryMessage.Message);
            return Ok(inventoryMessage.RequestNumber);
        }


        [HttpPost("CheckProformaInserted")]
        public IActionResult CheckProformaInserted([FromBody] RequestStatus requestStatus)
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

        [HttpPost("CheckProformaUpdated")]
        public IActionResult CheckProformaUpdated([FromBody] RequestStatus requestStatus)
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
        public IActionResult Update([FromBody] Proforma proforma)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Update.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(proforma);
            _rabbitMqService.Enqueue(_ProformaRequest, inventoryMessage);
            var insertRequest = new RequestStatus();
            insertRequest.Status = "Processing";
            insertRequest.Id = inventoryMessage.RequestNumber;
            _context.RequestStatus.Add(insertRequest);
            _loggingService.Log(User.Identity.Name, LogAction.UPDATE, inventoryMessage.Message);
            return Ok(inventoryMessage.RequestNumber);
        }

        [HttpDelete("[action]")]
        public IActionResult Delete(int proformaId)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Delete.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(proformaId);
            _rabbitMqService.Enqueue(_ProformaRequest, inventoryMessage);
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
            _rabbitMqService.Enqueue(_ProformaRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.INSERT, inventoryMessage.Message);
            return Ok();
        }

    }
}