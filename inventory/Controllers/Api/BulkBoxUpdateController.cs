using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using inventory.Data;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;
using System;
using System.Text.Json;
using inventory.Services;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Box.RoleName)]
    [Route("api/BulkBoxUpdate")]
    public class BulkBoxUpdateController : Controller
    {
        private readonly ApplicationDbContext _context;
        private string _boxRequest = "BoxRequest";
        private IRabbitMqService _rabbitMqService;

        public BulkBoxUpdateController(ApplicationDbContext context,
                    IRabbitMqService rabbitMqService)
        {
            _context = context;
            _rabbitMqService = rabbitMqService;
        }

        [HttpPut("[action]")]
        public IActionResult Update([FromBody]List<Box> boxes)
        {   
            foreach (var box in boxes)
            {

                var inventoryMessage = new InventoryMessage();
                inventoryMessage.Command = InventoryMessageType.Update.ToString();
                inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
                inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
                inventoryMessage.Message = JsonSerializer.Serialize(box);
                _rabbitMqService.Enqueue(_boxRequest, inventoryMessage);
            }
            return Ok();
        }   
      
    }
}