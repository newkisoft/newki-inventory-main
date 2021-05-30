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
    [Route("api/containerloadingplan")]
    public class ContainerLoadingPlanController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const string bucketName = "newki";
        private const string filePath = "https://newki.s3.amazonaws.com";
        private static readonly RegionEndpoint bucketRegion = RegionEndpoint.USEast1;

        public ContainerLoadingPlanController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Invoice
        [HttpGet]
        public IActionResult Get()
        {
            var Items = _context.ContainerPlan;
            int Count = Items.Count();
            return Ok(new { Items, Count });
        }

        // GET: api/Invoice
        [HttpGet("GetContainer/{id}")]
        public IActionResult GetContainer(int id)
        {
            var Item = _context.ContainerPlan
            .Include(p => p.Files)
            .ThenInclude(w => w.File)
            .Include(p => p.PalletPlans)
            .ThenInclude(w => w.PalletPlan)
            .FirstOrDefault(p => p.ContainerPlanId == id);
            return Ok(Item);
        }

        [HttpPost("[action]")]
        public IActionResult Insert([FromBody] object containerInput)
        {
            var container = JsonSerializer.Deserialize<ContainerPlan>(containerInput.ToString());
            _context.ContainerPlan.Add(container);
            _context.SaveChanges();
            return Ok(container);
        }


        [HttpPost("[action]")]
        public IActionResult Update([FromBody] ContainerPlan container)
        {

            var existingContainer = _context.ContainerPlan.Include(p => p.PalletPlans)
                                        .ThenInclude(w=>w.PalletPlan)
                                        .FirstOrDefault(p => p.ContainerPlanId == container.ContainerPlanId);

            foreach (var containerPallet in existingContainer.PalletPlans)
            {
                var newPallet = container.PalletPlans.FirstOrDefault(p => p.PalletPlanId == containerPallet.PalletPlanId);
                if (newPallet == null)
                {
                    _context.ContainerPlanPalletPlan.Remove(containerPallet);
                }
                else
                {
                    existingContainer.Name = container.Name;
                    existingContainer.EstimateArrivalDate = container.EstimateArrivalDate;
                    existingContainer.Note = container.Note;
                    containerPallet.PalletPlan.Details = newPallet.PalletPlan.Details;
                    containerPallet.PalletPlan.Weight = newPallet.PalletPlan.Weight;         
                    containerPallet.Customer = newPallet.Customer;           
                }
            }
            _context.SaveChanges();
            var newPallets = container.PalletPlans.Where(p=>p.PalletPlan.PalletPlanId == 0);
            foreach(var newPallet in newPallets)
            {             
                newPallet.ContainerPlanId = container.ContainerPlanId;                 
                _context.ContainerPlanPalletPlan.Add(newPallet);
                _context.SaveChanges();
            }


            return Ok(container);
        }

        [HttpPost("[action]")]
        public IActionResult UploadFile([FromBody] DocumentFile file)
        {
            _context.DocumentFile.Add(file);
            _context.SaveChanges();
            return Ok(file);
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(int id)
        {
            var container = _context.ContainerPlan.FirstOrDefault(p => p.ContainerPlanId == id);

            _context.ContainerPlan.Remove(container);
            _context.SaveChanges();
            return Ok(container);

        }


    }
}