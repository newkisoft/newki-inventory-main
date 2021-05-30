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
    [Authorize(Roles = Pages.MainMenu.Box.RoleName)]
    [Route("api/Box")]
    public class BoxController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILoggingService _loggingService;
        private IRabbitMqService _rabbitMqService;
        private string _BoxRequest = "BoxRequest";

        public BoxController(ApplicationDbContext context,
                                ILoggingService loggingService,
                                IRabbitMqService rabbitMqService)
        {
            _context = context;
            _loggingService = loggingService;
            _rabbitMqService = rabbitMqService;

        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            List<Box> Items = await _context.Box
            .OrderByDescending(p => p.BoxId).ToListAsync();
            int Count = Items.Count();
            return Ok(new { Items, Count });

        }

        [HttpGet("GetBoxByBarcode/{id}")]
        public IActionResult GetBoxByBarcode(string barcode)
        {

            var Box = _context.BoxDataView.FirstOrDefault(p => p.Data.Contains(barcode));
            if (Box == null)
                return Ok();
            return Ok(JsonSerializer.Deserialize<Box>(Box.Data));

        }

        [HttpGet("GetBox/{id}")]
        public IActionResult GetBox(int id)
        {

            var Box = _context.BoxDataView.FirstOrDefault(p => p.BoxId == id);
            return Ok(JsonSerializer.Deserialize<Box>(Box.Data));

        }

        [HttpPost("search")]
        public IActionResult GetBox([FromBody] List<string> keywords)
        {
            var boxDataViews = new List<BoxDataView>();
            var boxes = new List<Box>();

            var parameterExp = Expression.Parameter(typeof(BoxDataView), "type");
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

            var lambda = Expression.Lambda<Func<BoxDataView, bool>>(allExpressions, parameterExp);
            boxDataViews.AddRange(_context.BoxDataView.Where(lambda));

            foreach (var box in boxDataViews)
            {
                boxes.Add(JsonSerializer.Deserialize<Box>(box.Data));
            }
            boxes = boxes.OrderByDescending(p => p.BoxId).ToList();

            return Ok(boxes);

        }

        [HttpPost("[action]")]
        public IActionResult Insert([FromBody] Box Box)
        {

            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Insert.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(Box);
            _rabbitMqService.Enqueue(_BoxRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.INSERT, inventoryMessage.Message);
            return Ok();
        }

        [HttpPut("[action]")]
        public IActionResult UpdateAsync([FromBody] Box Box)
        {

            var inventoryMessage = new InventoryMessage();
            inventoryMessage.Command = InventoryMessageType.Update.ToString();
            inventoryMessage.MessageDate = DateTimeOffset.UtcNow;
            inventoryMessage.RequestNumber = Guid.NewGuid().ToString();
            inventoryMessage.Message = JsonSerializer.Serialize(Box);
            _rabbitMqService.Enqueue(_BoxRequest, inventoryMessage);
            _loggingService.Log(User.Identity.Name, LogAction.UPDATE, inventoryMessage.Message);
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
            _rabbitMqService.Enqueue(_BoxRequest, inventoryMessage);
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

            _rabbitMqService.Enqueue(_BoxRequest, inventoryMessage);
            

            return Ok();
        }
        public List<string> GetYarnTypeFilters()
        {
            var yarnTypes = _context.Box.Select(p => p.YarnType).Distinct().ToList();
            yarnTypes.RemoveAll(string.IsNullOrEmpty);
            return yarnTypes;

        }

    }
}