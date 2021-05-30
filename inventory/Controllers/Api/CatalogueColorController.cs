using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Authorization;
using Amazon.S3;
using System.IO;
using System.Text.Json;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.CatalogueColor.RoleName)]
    [Route("api/CatalogueColor")]
    public class CatalogueColorController : Controller
    {
        private readonly ApplicationDbContext _context;

        private ICatalogueColorTable _colorTable;        

        public CatalogueColorController(ApplicationDbContext context,
                        ICatalogueColorTable colorTable)
        {
            _context = context;           
            _colorTable = colorTable;
        }

        // GET: api/Prices
        [HttpGet("GetColors")]
        public async Task<IActionResult> GetColors()
        {
            return Ok( await _colorTable.GetItems());
        }

        [HttpGet("GetColor/{id}")]
        public async Task<IActionResult> GetColor(string id)
        {
            return Ok( await _colorTable.GetColor(id));
        }


        [HttpPost("[action]")]
        [Route("Insert")]
        public void Insert([FromBody]CatalogueColor catalogueColor)
        {
            try
            {
              _colorTable.Insert(catalogueColor);
            }
            catch (AmazonS3Exception e)
            {
                Console.WriteLine("Error encountered on server. Message:'{0}' when writing an object", e.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine("Unknown encountered on server. Message:'{0}' when writing an object", e.Message);
            }
        }  

        [HttpPost("[action]")]
        [Route("InsertBulk")]
        public void InsertBulk()
        {            
              using (var stream = new StreamReader(Request.Body))
            {   
                var message = stream.ReadToEndAsync();
                var file =  JsonSerializer.Deserialize<UploadFile>(message.Result); 
                var bytes = Convert.FromBase64String(file.value.Split("base64,")[1]);
                using(var contents = new MemoryStream(bytes))
                {
                    var reader = new StreamReader(contents);
                    string line;
                   while ((line = reader.ReadLine()) != null){
                       var values = line.Split(',');
                       var catalogueColor = new CatalogueColor();
                       catalogueColor.ColorCode = values[0];
                       catalogueColor.Color = values[1];
                       catalogueColor.Catalogue = values[2];
                       catalogueColor.PageNumber = values[3];
                       if(values.Length>4)
                            catalogueColor.Comment = values[4];
                       catalogueColor.Id = catalogueColor.ColorCode;
                       _colorTable.Insert(catalogueColor);
                   }
                }
            }
        }     

        [HttpPost("[action]")]
        [Route("Update")]
        public void Update([FromBody]CatalogueColor catalogueColor)
        {
            try
            {
              _colorTable.Update(catalogueColor);
            }
            catch (AmazonS3Exception e)
            {
                Console.WriteLine("Error encountered on server. Message:'{0}' when writing an object", e.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine("Unknown encountered on server. Message:'{0}' when writing an object", e.Message);
            }
        }       
    }
}