using System.Linq;
using System.Net;
using System.Net.Mime;
using inventory.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using inventory.Models.CommercialInvoiceReport;
using System.Text.Json;
using System.Collections.Generic;
using newkilibraries;

namespace inventory.Controllers
{    
    public class CommercialInvoiceReportController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CommercialInvoiceReportController(ApplicationDbContext context){
            _context = context;
        }
        public IActionResult Index(int id)
        {
            var CommercialInvoiceReport = new CommercialInvoiceReport();
            var CommercialInvoice = _context.CommercialInvoice.Include(p=>p.Extras).FirstOrDefault(p=>p.CommercialInvoiceId == id);
            var letterhead =  _context.Setting.FirstOrDefault(p=>p.Key=="Letterhead");
            var headers = letterhead!=null? JsonSerializer.Deserialize<List<string>>(letterhead.Value):null;

            CommercialInvoiceReport.CommercialInvoiceDate = CommercialInvoice.CommercialInvoiceDate.ToString("dd/MM/yyyy");
            CommercialInvoiceReport.TotalUsd = CommercialInvoice.TotalUsd;
            CommercialInvoiceReport.ExchangeRate = CommercialInvoice.ExchangeRate;
            CommercialInvoiceReport.Tax = CommercialInvoice.Tax;
            CommercialInvoiceReport.Kdv = CommercialInvoice.Kdv;     
            CommercialInvoiceReport.Seller = CommercialInvoice.Seller;       
            CommercialInvoiceReport.Buyer = CommercialInvoice.Buyer;
            CommercialInvoiceReport.Consignee = CommercialInvoice.Consignee;
            CommercialInvoiceReport.CountryOfBeneficiary = CommercialInvoice.CountryOfBeneficiary;
            CommercialInvoiceReport.CountryOfDestination = CommercialInvoice.CountryOfDestination;
            CommercialInvoiceReport.CountryOfOrigin = CommercialInvoice.CountryOfOrigin;
            CommercialInvoiceReport.HsCode = CommercialInvoice.HsCode;
            CommercialInvoiceReport.PackageDescription = CommercialInvoice.PackageDescription;
            CommercialInvoiceReport.FreightForwarder = CommercialInvoice.FreightForwarder;
            CommercialInvoiceReport.PartialShipment = CommercialInvoice.PartialShipment;
            CommercialInvoiceReport.RelevantLocation = CommercialInvoice.RelevantLocation;
            CommercialInvoiceReport.Size = CommercialInvoice.Size;
            CommercialInvoiceReport.Port = CommercialInvoice.Port;
            CommercialInvoiceReport.TermsOfDelivery = CommercialInvoice.TermsOfDelivery;
            CommercialInvoiceReport.TermsOfPayment = CommercialInvoice.TermsOfPayment;
            CommercialInvoiceReport.TotalGross = CommercialInvoice.TotalGross;
            CommercialInvoiceReport.TransportBy = CommercialInvoice.TransportBy;
            CommercialInvoiceReport.Currency = CommercialInvoice.Currency!=null && CommercialInvoice.Currency=="Euro"? CommercialInvoice.Currency.ToLower():"dollar";
            CommercialInvoiceReport.ValidUntil = CommercialInvoice.LoadingDate.ToString("dd/MM/yyyy");
            CommercialInvoiceReport.Extras = CommercialInvoice.Extras;


            if(headers !=null)
            {
                CommercialInvoiceReport.Header = headers[0];
                CommercialInvoiceReport.Footer =headers.Count>1 ? headers[1]:"";
            }
            var invoice = _context.Invoice.Include(p=>p.InvoicePallets).ThenInclude(p=>p.Pallet).FirstOrDefault(p=>p.InvoiceId == CommercialInvoice.InvoiceId);
            CommercialInvoiceReport.Pallets = new List<Pallet>();
            foreach(var pallet in invoice.InvoicePallets.OrderBy(p=>p.Pallet.ColorCode))
            {               
                CommercialInvoiceReport.Pallets.Add(pallet.Pallet);
            }
            return View(CommercialInvoiceReport);
        }
        

        public ActionResult Print(int id)
        {      
            var CommercialInvoice = _context.CommercialInvoice.FirstOrDefault(p=>p.CommercialInvoiceId == id);
            
            string command = $"python3 htmltopdfcommercial.py '{id}'";
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
            string fileName = $"commercial-{id}.pdf", myStringWebResource = null;
            myStringWebResource = $"{remoteUri}/{fileName}";
            using (WebClient myWebClient = new WebClient())            
            {
                var file = myWebClient.DownloadData(myStringWebResource);                            
                
                return File(file, MediaTypeNames.Application.Pdf);    
            } 
        }
    }
}