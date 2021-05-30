using System.Linq;
using System.Net;
using System.Net.Mime;
using inventory.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using inventory.Models.ProformaReport;
using System.Text.Json;
using System.Collections.Generic;

namespace inventory.Controllers
{    
    public class ProformaReportController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProformaReportController(ApplicationDbContext context){
            _context = context;
        }
        public IActionResult Index(int id)
        {
            var proformaReport = new ProformaReport();
            var proforma = _context.Proforma.Include(p=>p.Customer).Include(p=>p.ProformaProformaItems).ThenInclude(p=>p.ProformaItem)            
            .FirstOrDefault(p=>p.ProformaId == id);
            var letterhead =  _context.Setting.FirstOrDefault(p=>p.Key=="Letterhead");
            var headers = letterhead!=null? JsonSerializer.Deserialize<List<string>>(letterhead.Value):null;

            proformaReport.ProformaDate = proforma.ProformaDate.ToString("dd/MM/yyyy");
            proformaReport.Customer = proforma.Customer;
            proformaReport.ProformaProformaItems = proforma.ProformaProformaItems;            
            proformaReport.TotalUsd = proforma.TotalUsd;
            proformaReport.ExchangeRate = proforma.ExchangeRate;
            proformaReport.Tax = proforma.Tax;
            proformaReport.Kdv = proforma.Kdv;     
            proformaReport.Seller = proforma.Seller;       
            proformaReport.Buyer = proforma.Buyer;
            proformaReport.Consignee = proforma.Consignee;
            proformaReport.CountryOfBeneficiary = proforma.CountryOfBeneficiary;
            proformaReport.CountryOfDestination = proforma.CountryOfDestination;
            proformaReport.CountryOfOrigin = proforma.CountryOfOrigin;
            proformaReport.HsCode = proforma.HsCode;
            proformaReport.PackageDescription = proforma.PackageDescription;
            proformaReport.FreightForwarder = proforma.FreightForwarder;
            proformaReport.PartialShipment = proforma.PartialShipment;
            proformaReport.RelevantLocation = proforma.RelevantLocation;
            proformaReport.Size = proforma.Size;
            proformaReport.Port = proforma.Port;
            proformaReport.TermsOfDelivery = proforma.TermsOfDelivery;
            proformaReport.TermsOfPayment = proforma.TermsOfPayment;
            proformaReport.TotalGross = proforma.TotalGross;
            proformaReport.TransportBy = proforma.TransportBy;
            proformaReport.Currency = proforma.Currency!=null && proforma.Currency=="Euro"? proforma.Currency.ToLower():"dollar";
            proformaReport.ValidUntil = proforma.ValidUntil.ToString("dd/MM/yyyy");
            proformaReport.BankAccounts = proforma.BankAccounts;
            proformaReport.ProformaNumber = proforma.ProformaNumber;
            proformaReport.ProformaId = proforma.ProformaId;

            if(headers !=null)
            {
                proformaReport.Header = headers[0];
                proformaReport.Footer =headers.Count>1? headers[1]:"";
            }
            string[] usd = {"0","0"};
            usd = Math.Round(proforma.TotalUsd * proforma.ExchangeRate,3,MidpointRounding.ToEven).ToString().Split(".");            

            var english = $"{int.Parse(usd[0]).ToWords()} lira and {int.Parse(usd[1]).ToWords()} cents";            
            var turkish = $"{int.Parse(usd[0]).ToTurkishWords()} lira {int.Parse(usd[1]).ToTurkishWords()} krş";            
            proformaReport.AmountInWords = turkish;
            return View(proformaReport);
        }
        

        public ActionResult Print(int id)
        {      
            var proforma = _context.Proforma.FirstOrDefault(p=>p.ProformaId == id);
            
            string command = $"python3 htmltopdfproforma.py '{id}'";
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
            string fileName = $"proforma-{id}.pdf", myStringWebResource = null;
            myStringWebResource = $"{remoteUri}/{fileName}";
            using (WebClient myWebClient = new WebClient())            
            {
                var file = myWebClient.DownloadData(myStringWebResource);                            
                
                return File(file, MediaTypeNames.Application.Pdf);    
            } 
        }
    }
}