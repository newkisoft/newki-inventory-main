using System.Linq;
using System.Net;
using System.Net.Mime;
using inventory.Data;
using inventory.Models.InvoiceReport;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace inventory.Controllers
{    
    public class InvoiceReportController : Controller
    {
        private readonly ApplicationDbContext _context;

        public InvoiceReportController(ApplicationDbContext context){
            _context = context;
        }
        public IActionResult Index(int id)
        {
            var invoiceReport = new InvoiceReport();
            var invoice = _context.Invoice.Include(p=>p.Customer).Include(p=>p.InvoicePallets).ThenInclude(p=>p.Pallet)
            .Include(p=>p.InvoiceBoxes).ThenInclude(p=>p.Box)
            .FirstOrDefault(p=>p.InvoiceId == id);
            invoiceReport.InvoiceDate = invoice.InvoiceDate.ToString("dd/MM/yyyy");
            invoiceReport.Customer = invoice.Customer;
            invoiceReport.InvoicePallets = invoice.InvoicePallets;
            invoiceReport.InvoiceBoxes = invoice.InvoiceBoxes;
            invoiceReport.TotalUsd = invoice.TotalUsd;
            invoiceReport.ExchangeRate = invoice.ExchangeRate;
            invoiceReport.Tax = invoice.Tax;
            invoiceReport.Kdv = invoice.Kdv;
            invoiceReport.Discount = invoice.Discount;
            invoiceReport.StateInvoiceNumber = invoice.StateInvoiceNumber;
            foreach(var item in invoice.InvoiceBoxes)
            {
                invoiceReport.TotalWeight += item.Weight;
            }
            foreach(var item in invoice.InvoicePallets)
            {
                invoiceReport.TotalWeight += item.Weight;
            }

            string[] usd = {"0","0"};
            usd = Math.Round(invoice.TotalUsd * invoice.ExchangeRate,3,MidpointRounding.ToEven).ToString().Split(".");            

            var english = usd.Count()>1 ? $"{int.Parse(usd[0]).ToWords()} lira and {int.Parse(usd[1]).ToWords()} cents":$"{usd[0]} lira";            
            var turkish = usd.Count()>1 ? $"{int.Parse(usd[0]).ToTurkishWords()} lira {int.Parse(usd[1]).ToTurkishWords()} krş":$"${usd[0]} lira";            
            invoiceReport.AmountInWords = turkish;
            return View(invoiceReport);
        }
        

        public ActionResult Print(int id)
        {      
            var pallet = _context.Invoice.FirstOrDefault(p=>p.InvoiceId == id);
            
            string command = $"python3 htmltopdfinvoice.py '{id}'";
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
            string fileName = $"invoice-{id}.pdf", myStringWebResource = null;
            myStringWebResource = $"{remoteUri}/{fileName}";
            using (WebClient myWebClient = new WebClient())            
            {
                var file = myWebClient.DownloadData(myStringWebResource);                            
                
                return File(file, MediaTypeNames.Application.Pdf);    
            } 
        }
    }
}