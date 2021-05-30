using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Product.RoleName)]
    [Route("api/Product")]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly WebsiteDbContext _websiteDbontext;

        public ProductController(ApplicationDbContext context,
                                WebsiteDbContext websiteContext)
        {
            _context = context;
            _websiteDbontext = websiteContext;
        }

        [HttpGet]
        public async Task<IActionResult> Getproducts()
        {  
                List<Product> Items = await _context.Product.OrderByDescending(p=>p.ProductId).ToListAsync();
                int Count = Items.Count();
                return Ok(new { Items, Count });
           
        } 

        [HttpGet("GetProduct/{id}")]
        public IActionResult GetProduct(int id)
        {  
            Product product = _context.Product.FirstOrDefault(p=>p.ProductId == id);                
            return Ok(product);           
        } 

        [HttpPost("[action]")]
        public IActionResult Insert([FromBody]Product product)
        {            
            _context.Product.Add(product);
            _context.SaveChanges();
            return Ok(product);
        }

        [HttpPut("[action]")]
        public IActionResult Update([FromBody]Product product)
        {        
            _context.Product.Update((Product)product);
            _context.SaveChanges();
            return Ok(product);
        }
    
        [HttpGet("[action]")]
        public IActionResult PUblish()
        {        
            var listProducts = _context.Product.ToList();
            var websiteProducts = _websiteDbontext.Product.ToList();
            foreach(var prod in websiteProducts){
                _websiteDbontext.Product.Remove(prod);
            }
            
            _websiteDbontext.SaveChanges();
            foreach(var prod in listProducts){
                prod.ProductId = 0;
                _websiteDbontext.Product.Add(prod);
                _websiteDbontext.SaveChanges();
            }

            
            return Ok();
        }
    

        [HttpDelete("Remove/{id}")]
        public IActionResult Remove(int id)
        {            
            var product = _context.Product
                .Where(x => x.ProductId == id)
                .FirstOrDefault();
            _context.Product.Remove(product);
            _context.SaveChanges();
            return Ok(product);
        }
    }
}