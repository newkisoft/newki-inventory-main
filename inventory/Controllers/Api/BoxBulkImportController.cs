using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Amazon;
using inventory.Services;
using newkilibraries;
using System.Text.Json;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.BulkUpload.RoleName)]
    [Route("api/BoxBulkImport")]
    public class BoxBulkImportController : Controller
    {
        private readonly IRabbitMqService _rabbitMqService;
        private static readonly RegionEndpoint bucketRegion = RegionEndpoint.USEast1;

        public BoxBulkImportController(IRabbitMqService rabbitMqService)
        {
            _rabbitMqService = rabbitMqService;
        }



        [HttpPost("[action]")]
        [Route("UpdateAsync")]
        public  IActionResult UpdateAsync([FromBody] UploadFile uploadFile)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Update.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(uploadFile);
            _rabbitMqService.Enqueue("BulkImportRequest", inventoryMessage);
            return Ok();

        }

    }
}