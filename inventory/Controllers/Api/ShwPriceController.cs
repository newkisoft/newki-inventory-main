using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using inventory.Models;
using Microsoft.AspNetCore.Authorization;
using Amazon;
using newkilibraries;
using inventory.Services;
using Amazon.SQS;
using System.Text.Json;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Price.RoleName)]
    [Route("api/ShwPrice")]
    public class ShwPriceController : Controller
    {
        private readonly IRabbitMqService _rabbitMqService;
        private readonly IAwsService _awsService;
        private IAwsStorageConfig _awsStorageConfig;
        private string _priceRequest = "PriceRequest";

        public ShwPriceController(
                                IAwsStorageConfig awsStorageConfig,
                                IAwsService awsService,
                                IRabbitMqService rabbitMqService)
        {
            _rabbitMqService = rabbitMqService;
            _awsService = awsService;
            _awsStorageConfig = awsStorageConfig;
        }

 
        [HttpPost("[action]")]
        [Route("Update")]
        public IActionResult UpdateAsync([FromBody] UploadFile uploadFile)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.ShwPrice.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(uploadFile);
            _rabbitMqService.Enqueue(_priceRequest,inventoryMessage);
            return Ok();
        }


        [HttpGet("[action]")]
        [Route("UpdatePallets")]
        public IActionResult UpdatePallets()
        {


            return Ok();
        }
    }
}