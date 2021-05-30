using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Authorization;
using Amazon.S3;
using Amazon;
using Amazon.Runtime.CredentialManagement;
using System.Text.Json;
using newkilibraries;
using newkilibraries.inventory;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Samples.RoleName)]
    [Route("api/Order")]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const string bucketName = "newki";
        private const string filePath = "https://newki.s3.amazonaws.com";
        private static readonly RegionEndpoint bucketRegion = RegionEndpoint.USEast1;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Order
        [HttpGet]
        public async Task<IActionResult> GetOrder()
        {
            List<Order> Items = await _context.Order           
            .OrderByDescending(p=>p.OrderDate) 
            .Include(p => p.Files).ThenInclude(w => w.File)
            .Include(p => p.Customer).ToListAsync();
            int Count = Items.Count();
            return Ok(new { Items, Count });
        }

        // GET: api/Order
        [HttpGet("GetOrder/{id}")]
        public IActionResult GetOrder(int id)
        {
            Order Item = _context.Order.Include(p => p.Customer)
            .Include(p => p.Files).ThenInclude(w => w.File)
            .FirstOrDefault(p => p.OrderId == id);
            return Ok(Item);
        }

          [HttpPost("[action]")]
        public IActionResult Insert([FromBody]object orderInput)
        {
            var order = JsonSerializer.Deserialize<Order>(orderInput.ToString());
            order.Customer = _context.Customer.FirstOrDefault(p => p.CustomerId == order.Customer.CustomerId);
            _context.Order.Add(order);
            _context.SaveChanges();
            return Ok(order);
        }


        [HttpPost("[action]")]
        public IActionResult Update([FromBody]Order order)
        {
            var newCustomer = _context.Customer
            .FirstOrDefault(p => p.CustomerId == order.Customer.CustomerId);
            var oldOrder = _context.Order
                                    .Include(p => p.Files).ThenInclude(w => w.File)
                                    .FirstOrDefault(p => p.OrderId == order.OrderId);

            foreach (var oldOrderDocument in oldOrder.Files)
            {
                _context.DocumentFile.Remove(oldOrderDocument.File);
            }
            _context.OrderDocumentFile.RemoveRange(oldOrder.Files);


            _context.SaveChanges();


            foreach (var file in order.Files)
            {
                var oldFile = _context.DocumentFile.FirstOrDefault(p => p.DocumentFileId == file.DocumentFileId);
                if (oldFile == null)
                {
                    oldOrder.Files.Add(file);
                }
                else
                {
                    var newOrderFile = new OrderDocumentFile();
                    newOrderFile.DocumentFileId = oldFile.DocumentFileId;
                    newOrderFile.OrderId = order.OrderId;
                    oldOrder.Files.Add(newOrderFile);
                }
            }

            oldOrder.Customer = newCustomer;
            oldOrder.OrderDate = order.OrderDate.ToLocalTime();
            oldOrder.Comment = order.Comment;

            _context.Order.Update(oldOrder);
            _context.SaveChanges();
            return Ok(order);
        }

        [HttpDelete("[action]")]
        public IActionResult Delete(int orderId)
        {
            Order orderOld = _context.Order
                .Where(x => x.OrderId == orderId)
                .FirstOrDefault();

            _context.Order.Remove(orderOld);
            _context.SaveChanges();
            return Ok(orderOld);

        }


    }
}