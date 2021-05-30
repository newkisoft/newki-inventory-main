using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using inventory.Services;
using Microsoft.AspNetCore.Authorization;
using Amazon.S3;
using Amazon;
using Amazon.Runtime.CredentialManagement;
using System.Text.Json;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.GoodsContainer.RoleName)]
    [Route("api/goodscontainer")]
    public class GoodsContainerController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const string bucketName = "newki";
        private const string filePath = "https://newki.s3.amazonaws.com";
        private static readonly RegionEndpoint bucketRegion = RegionEndpoint.USEast1;

        public GoodsContainerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Invoice
        [HttpGet]
        public IActionResult Get()
        {
            var Items = _context.GoodsContainer
            .OrderByDescending(p => p.ImportDate).ToList();
            int Count = Items.Count();
            return Ok(new { Items, Count });
        }
        
        // GET: api/Invoice
        [HttpGet("GetContainer/{id}")]
        public IActionResult GetContainer(int id)
        {
            GoodsContainer Item = _context.GoodsContainer
            .Include(p => p.Files)
            .ThenInclude(w => w.File)
            .Include(p => p.GoodsContainerPallets)
            .ThenInclude(w => w.Pallet)
            .FirstOrDefault(p => p.GoodsContainerId == id);
            return Ok(Item);
        }

        // GET: api/Invoice
        [HttpGet("CountStock/{id}")]
        public IActionResult CountStock(int id)
        {
            GoodsContainer Item = _context.GoodsContainer                        
            .Include(p => p.GoodsContainerPallets)
            .ThenInclude(w => w.Pallet)
            .FirstOrDefault(p => p.GoodsContainerId == id);
            var sotck = Item.GoodsContainerPallets.Where(p=>p.Pallet.Sold == false);
            var count = sotck.Count();
            return Ok(new {id,count});
        }

        [HttpPost("[action]")]
        public IActionResult Insert([FromBody]object containerInput)
        {
            var container = JsonSerializer.Deserialize<GoodsContainer>(containerInput.ToString());
            _context.GoodsContainer.Add(container);
            _context.SaveChanges();
            return Ok(container);
        }


        [HttpPost("[action]")]
        public IActionResult Update([FromBody]GoodsContainer container)
        {
            var newPallets = container.GoodsContainerPallets.ToList();
            var newFiles = container.Files.ToList();

            var existingPallets = _context.GoodsContainerPallet
                                  .Where(p => p.GoodsContainerId == container.GoodsContainerId);
            var existingDocuments = _context.GoodsContainerDocumentFile
                                  .Where(p => p.GoodsContainerId == container.GoodsContainerId);

            container.Files = existingDocuments.ToList();

            _context.GoodsContainer.Update(container);
            _context.GoodsContainerPallet.RemoveRange(existingPallets);
            _context.GoodsContainerDocumentFile.RemoveRange(existingDocuments);
            _context.SaveChanges();
          
            _context.GoodsContainerPallet.AddRange(newPallets);
            _context.SaveChanges();

            newFiles.ForEach(p => p.File = null);
            _context.GoodsContainerDocumentFile.AddRange(newFiles);
            _context.SaveChanges();

            return Ok(container);
        }

        [HttpPost("[action]")]
        public IActionResult UploadFile([FromBody]DocumentFile file)
        {
            _context.DocumentFile.Add(file);
            _context.SaveChanges();
            return Ok(file);
        }

        [HttpDelete("[action]")]
        public IActionResult Delete(int goodsContainerId)
        {
            var container = _context.GoodsContainer.FirstOrDefault(p => p.GoodsContainerId == goodsContainerId);

            _context.GoodsContainer.Remove(container);
            _context.SaveChanges();
            return Ok(container);

        }


    }
}