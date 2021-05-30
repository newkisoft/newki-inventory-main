using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;
using inventory.Services;
using System.Text.Json;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.BulkUpload.RoleName)]
    [Route("api/PalletBulkImport")]
    public class PalletBulkImportController : Controller
    {
       
        private readonly IRabbitMqService _rabbitMqService;
       
        public PalletBulkImportController(
                                IRabbitMqService rabbitMqService)
        {
            _rabbitMqService = rabbitMqService;
        }



        [HttpPost("[action]")]
        [Route("UpdateAsync")]
        public IActionResult UpdateAsync([FromBody] UploadFile uploadFile)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Insert.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(uploadFile);
            _rabbitMqService.Enqueue("BulkImportRequest", inventoryMessage);
           return Ok();
        }
      
    }
}