using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using inventory.Data;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;
using inventory.Services;
using System;
using System.Text.Json;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Customer.RoleName)]
    [Route("api/Customer")]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IRabbitMqService _rabbitMqService;
        private readonly ILoggingService _loggingService;
        private readonly string _customerRequest ="CustomerRequest";

        public CustomerController(
                                ApplicationDbContext context,
                                ILoggingService loggingService,
                                IRabbitMqService rabbitMqService)
        {
            _loggingService = loggingService;
            _context = context;
            _rabbitMqService = rabbitMqService;         

        }

        // GET: api/Customer
        [HttpGet]
        public IActionResult GetCustomers()
        {

            var customers = new List<Customer>();
            foreach (var data in _context.CustomerDataView.OrderByDescending(p => p.CustomerId))
            {
                var customer = JsonSerializer.Deserialize<Customer>(data.Data);
                customers.Add(customer);
            }
            return Ok(customers);
        }

        [HttpGet("GetCustomer/{id}")]
        public IActionResult GetCustomer(int id)
        {

            var customer = _context.CustomerDataView.FirstOrDefault(p => p.CustomerId == id);
            return Ok(JsonSerializer.Deserialize<Customer>(customer.Data));

        }


        [HttpPost("[action]")]
        public  IActionResult Insert([FromBody] Customer customer)
        {

            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Insert.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(customer);
            _rabbitMqService.Enqueue(_customerRequest,inventoryMessage);
            return Ok();
        }

        [HttpPut("[action]")]
        public IActionResult Update([FromBody] Customer customer)
        {

            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Update.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(customer);
            _rabbitMqService.Enqueue(_customerRequest,inventoryMessage);
            return Ok();
        }

        [HttpDelete("Remove/{id}")]
        public IActionResult Remove(int id)
        {

            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Delete.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(id);
            _rabbitMqService.Enqueue(_customerRequest,inventoryMessage);
            return Ok();
        }
    }
}