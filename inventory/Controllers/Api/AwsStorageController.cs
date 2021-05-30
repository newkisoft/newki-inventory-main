using System;
using Microsoft.AspNetCore.Mvc;
using inventory.Services;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using inventory.Models;
using System.Text.Json;
using System.Threading.Tasks;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/AwsStorage")]
    public class AwsStorageController : Controller
    {
        private IAwsService _awsService;

        public AwsStorageController(IAwsService awsService)
        {
            _awsService = awsService;
        }
 
         
        [HttpGet("DownloadFile/{fileName}")]
        public IActionResult DownloadFile(string fileName)
        {        
               var file = _awsService.DownloadFileAsync(fileName).Result;
               if(file == null)
                    return Ok();

               return File(file.ResponseStream,  file.Headers.ContentType);
        }
   
        [HttpPost("[action]")]
        public void UploadFile()
        {            
            using (var stream = new StreamReader(Request.Body))
            {   
                var message = stream.ReadToEndAsync();
                var file =  JsonSerializer.Deserialize<UploadFile>(message.Result);
                var bytes = Convert.FromBase64String(file.value.Split("base64,")[1]);
                using(var contents = new MemoryStream(bytes))
                {                    
                    UploadFileAsync(file.filename,contents);
                }
            }
        }
       
        private void UploadFileAsync(string fileName, Stream fileToUpload)
        {
            _awsService.UploadFile(fileName,fileToUpload);
        }    
    }
}