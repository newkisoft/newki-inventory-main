using System.Collections.Generic;
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
    [Authorize(Roles = Pages.MainMenu.Pallet.RoleName)]
    [Route("api/BulkPalletUpdate")]
    public class BulkPalletUpdateController : Controller
    {
        private IRabbitMqService _rabbitMqService;
        private string _palletRequest = "PalletRequest";


        public BulkPalletUpdateController(ApplicationDbContext context,
                                IRabbitMqService rabbitMqService)
        {
            _rabbitMqService = rabbitMqService;
        }

        [HttpPut("[action]")]
        public IActionResult Update([FromBody] List<Pallet> pallets)
        {

            foreach (var pallet in pallets)
            {

                var inventoryMessage = new InventoryMessage();
                inventoryMessage.Command = InventoryMessageType.Update.ToString();
                inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
                inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
                inventoryMessage.Message = JsonSerializer.Serialize(pallet);
                _rabbitMqService.Enqueue(_palletRequest, inventoryMessage);
            }
            return Ok();
        }

    }
}