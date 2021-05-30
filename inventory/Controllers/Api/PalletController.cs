using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Authorization;
using inventory.Services;
using Amazon.SQS;
using newkilibraries;
using Amazon;
using System;
using System.Diagnostics;
using System.Text.Json;
using System.Linq.Expressions;
using System.Reflection;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Pallet.RoleName)]
    [Route("api/Pallet")]
    public class PalletController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILoggingService _loggingService;
        private IRabbitMqService _rabbitMqService;
        private string _palletRequest = "PalletRequest";

        public PalletController(ApplicationDbContext context,
                                ILoggingService loggingService,
                                IRabbitMqService rabbitMqService)
        {
            _context = context;
            _loggingService = loggingService;
            _rabbitMqService = rabbitMqService;

        }

        [HttpGet]
        public IActionResult Get()
        {
            List<Pallet> Items = _context.Pallet
            .OrderByDescending(p => p.PalletId).ToList();
            int Count = Items.Count();
            return Ok(new { Items, Count });

        }

        [HttpGet("GetPallet/{id}")]
        public IActionResult GetPallet(int id)
        {

            var pallet = _context.PalletDataView.FirstOrDefault(p => p.PalletId == id);
            return Ok(JsonSerializer.Deserialize<Pallet>(pallet.Data));

        }

        [HttpPost("search")]
        public IActionResult GetPallet([FromBody] List<string> keywords)
        {
            var palletDataViews = new List<PalletDataView>();
            var pallets = new List<Pallet>();

            var parameterExp = Expression.Parameter(typeof(PalletDataView), "type");
            var propertyExp = Expression.Property(parameterExp, "Data");
            MethodInfo method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
            var someValue = Expression.Constant("", typeof(string));
            var containsMethodExp = Expression.Call(propertyExp, method, someValue);
            var allExpressions= Expression.AndAlso(containsMethodExp,containsMethodExp);
            var columnName = "";

            foreach(var keyword in keywords.OrderBy(p=>p))
            {
                var newColumnName = keyword.Split(':')[0];
                MethodInfo containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                var keywordValue = Expression.Constant(keyword, typeof(string));
                var keywordMethodExpression = Expression.Call(propertyExp, containsMethod, keywordValue);
                if(columnName == newColumnName)
                {
                    allExpressions = Expression.OrElse(allExpressions, keywordMethodExpression);
                }
                else
                    allExpressions = Expression.AndAlso(allExpressions, keywordMethodExpression);
                columnName = newColumnName;
            }            

            var lambda = Expression.Lambda<Func<PalletDataView, bool>>(allExpressions, parameterExp);
            palletDataViews.AddRange(_context.PalletDataView.Where(lambda));

            foreach (var pallet in palletDataViews)
            {
                pallets.Add(JsonSerializer.Deserialize<Pallet>(pallet.Data));
            }
            pallets = pallets.OrderByDescending(p => p.PalletId).ToList();

            return Ok(pallets);

        }

        [HttpPost("[action]")]
        public IActionResult Insert([FromBody] Pallet pallet)
        {

            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Insert.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(pallet);
            _rabbitMqService.Enqueue(_palletRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.INSERT, inventoryMessage.Message);
            return Ok();
        }

        [HttpPut("[action]")]
        public IActionResult UpdateAsync([FromBody] Pallet pallet)
        {

            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Update.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(pallet);
            _rabbitMqService.Enqueue(_palletRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.UPDATE, inventoryMessage.Message);
            return Ok();
        }
        [HttpGet("[action]")]
        public IActionResult Print(int id, string customerName)
        {

            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Print.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(new PalletPrint { Id = id, CustomerName = customerName });
            _rabbitMqService.Enqueue(_palletRequest, inventoryMessage);
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
            _rabbitMqService.Enqueue(_palletRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.DELETE, inventoryMessage.Message);

            return Ok();
        }

        [HttpGet("Sync")]
        public IActionResult Sync()
        {

            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Search.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();

            _rabbitMqService.Enqueue(_palletRequest, inventoryMessage);            

            return Ok();
        }
        public List<string> GetWarehouseFilters()
        {
            var wareHouses = _context.Pallet.Select(p => p.Warehouse).Distinct().ToList();
            wareHouses.RemoveAll(string.IsNullOrEmpty);
            return wareHouses;

        }
        public List<string> GetYarnTypeFilters()
        {
            var yarnTypes = _context.Pallet.Select(p => p.YarnType).Distinct().ToList();
            yarnTypes.RemoveAll(string.IsNullOrEmpty);
            return yarnTypes;

        }

    }
}