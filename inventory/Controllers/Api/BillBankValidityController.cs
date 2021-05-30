using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using Microsoft.AspNetCore.Authorization;
using inventory.Services;
using newkilibraries;
using System;
using System.Text.Json;
using System.IO;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.BillBankValidity.RoleName)]
    [Route("api/BillBankValidity")]
    public class BillBankValidityController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IAwsService _awsService;
        private string _billBankRequest = "BillBankRequest";
        private IRabbitMqService _rabbitMqService;
        

        public BillBankValidityController(ApplicationDbContext context,
        IRabbitMqService rabbitMqService)
        {
            _context = context;
            _rabbitMqService = rabbitMqService;
        }

        [HttpGet("[action]")]
        public IActionResult Get()
        {
            var billDataViews = new List<BillBank>();
            var bills = _context.BillBankDataView.ToList();
            foreach(var bill in bills)
            {
                var b = JsonSerializer.Deserialize<BillBank>(bill.Data);
                billDataViews.Add(b);
            }
            return Ok(billDataViews);
        }
       
        [HttpPost("[action]")]
        public IActionResult Validate([FromBody]UploadFile file)
        {
            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Search.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.Message = JsonSerializer.Serialize(file);
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            _rabbitMqService.Enqueue(_billBankRequest, inventoryMessage);
            return Ok();
        }

    }
}