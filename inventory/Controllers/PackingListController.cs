using System.Net;
using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using newkilibraries;
using inventory.Services;

namespace inventory.Controllers
{    
    public class PackingListController : Controller
    {
        private readonly IPackageReport _packageReport;

        public PackingListController(IPackageReport packageReport){
            _packageReport = packageReport;
        }
        public IActionResult Index(int id)
        {
            return View(_packageReport.Get(id));
        }
        

        public ActionResult Print(int id)
        {      
            string command = $"python3 htmltopdfpacking.py '{id}'";
            string result = "";
            

            using (System.Diagnostics.Process proc = new System.Diagnostics.Process())
            {
                proc.StartInfo.FileName = "/bin/bash";
                proc.StartInfo.Arguments = "-c \" " + command + " \"";
                proc.StartInfo.UseShellExecute = false;
                proc.StartInfo.RedirectStandardOutput = true;
                proc.StartInfo.RedirectStandardError = true;
                proc.Start();

                result += proc.StandardOutput.ReadToEnd();
                result += proc.StandardError.ReadToEnd();

                proc.WaitForExit();
            }       

            string remoteUri = "wwwroot";
            string fileName = $"packing-{id}.pdf", myStringWebResource = null;
            myStringWebResource = $"{remoteUri}/{fileName}";
            using (WebClient myWebClient = new WebClient())            
            {
                var file = myWebClient.DownloadData(myStringWebResource);                            
                
                return File(file, MediaTypeNames.Application.Pdf);    
            } 
        }
    }
}