using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using inventory.Models;
using inventory.Services;
using Microsoft.AspNetCore.Authorization;
using Amazon;
using System.Text.Json;
using newkilibraries;
using Amazon.SQS;
using System.Diagnostics;
using inventory.Data;
using System.IO;
using System.Text;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Invoice.RoleName)]
    [Route("api/Invoice")]
    public class InvoiceController : Controller
    {
        private ILoggingService _loggingService;
        private readonly Amazon.Runtime.BasicAWSCredentials _credentials;
        private IAwsStorageConfig _awsStorageConfig;
        private ApplicationDbContext _context;
        private IRabbitMqService _rabbitMqService;
        private readonly string _invoiceRequest = "InvoiceRequest";

        public InvoiceController(ILoggingService loggingService,
                                 IAwsStorageConfig awsStorageConfig,
                                 ApplicationDbContext context,
                                 IRabbitMqService rabbitMqService)
        {
            _loggingService = loggingService;
            _awsStorageConfig = awsStorageConfig;
            _context = context;
            _rabbitMqService = rabbitMqService;

        }

        // GET: api/Invoice
        [HttpGet]
        public IActionResult GetInvoice()
        {
            var invoices = new List<Invoice>();
            foreach (var data in _context.InvoiceDataView.OrderByDescending(p => p.InvoiceId))
            {
                var invoice = JsonSerializer.Deserialize<Invoice>(data.Data);
                invoice.InvoiceBoxes = null;
                invoice.InvoicePallets = null;
                invoices.Add(invoice);
            }
            return Ok(invoices);
        }

   

        // GET: api/Invoice
        [HttpGet("GetInvoice/{id}")]
        public IActionResult GetInvoice(int id)
        {
            var invoice = _context.InvoiceDataView.FirstOrDefault(p => p.InvoiceId == id);
            return Ok(JsonSerializer.Deserialize<Invoice>(invoice.Data));
        }

        [HttpPost("[action]")]
        public IActionResult Insert([FromBody] Invoice invoice)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Insert.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(invoice);
            _rabbitMqService.Enqueue(_invoiceRequest, inventoryMessage);
            var insertRequest = new RequestStatus();
            insertRequest.Status = "Processing";
            insertRequest.Id = inventoryMessage.RequestNumber;
            _context.RequestStatus.Add(insertRequest);
            _loggingService.Log(User.Identity.Name, LogAction.INSERT, inventoryMessage.Message);
            return Ok(inventoryMessage.RequestNumber);
        }

        [HttpPost("CheckInvoiceInserted")]
        public IActionResult CheckInvoiceInserted([FromBody] RequestStatus requestStatus)
        {
            var request = _context.RequestStatus.FirstOrDefault(p=>p.Id == requestStatus.Id);
            if(request != null && request.Status != "Processing")
            {
                _context.RequestStatus.Remove(request);
                _context.SaveChanges();
                return Ok(request);            
            }
            return Ok(new RequestStatus());
        }

         [HttpPost("CheckInvoiceUpdated")]
        public IActionResult CheckInvoiceUpdated([FromBody] RequestStatus requestStatus)
        {
            var request = _context.RequestStatus.FirstOrDefault(p=>p.Id == requestStatus.Id);
            if(request != null && request.Status != "Processing")
            {
                _context.RequestStatus.Remove(request);
                _context.SaveChanges();
                return Ok(request);                 
            }
            return Ok(new RequestStatus());
        }


        [HttpPost("[action]")]
        public IActionResult Update([FromBody] Invoice invoice)
        {

            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Update.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(invoice);
            _rabbitMqService.Enqueue(_invoiceRequest, inventoryMessage);
            var insertRequest = new RequestStatus();
            insertRequest.Status = "Processing";
            insertRequest.Id = inventoryMessage.RequestNumber;
            _context.RequestStatus.Add(insertRequest);
            _loggingService.Log(User.Identity.Name, LogAction.UPDATE, inventoryMessage.Message);
            return Ok(inventoryMessage.RequestNumber);
        }

        [HttpDelete("[action]")]
        public IActionResult Delete(int invoiceId)
        {

            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Delete.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(invoiceId);
            _rabbitMqService.Enqueue(_invoiceRequest, inventoryMessage);
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
            _rabbitMqService.Enqueue(_invoiceRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.INSERT, inventoryMessage.Message);
            return Ok();
        }

    }
}