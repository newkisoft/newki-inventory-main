using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mime;
using inventory.Data;
using inventory.Models;
using inventory.Models.WarehouseViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newkilibraries;
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;

namespace inventory.Controllers
{    
    public class WarehouseTakeOutReportController : Controller
    {
        private readonly ApplicationDbContext _context;

        public WarehouseTakeOutReportController(ApplicationDbContext context){
            _context = context;
        }
        public IActionResult Index(string date,
            string name,
            string color,
            string colorCode,
            string denier,
            string yarnType,
            string palletBarcode,
            string palletWeight,
            string boxes )
        {
            var report = new ExitReport();
            if(string.IsNullOrEmpty(date))
                date = DateTime.Now.ToString("yyyy/MM/dd");            
            else{
                var dateTime = DateTime.Parse(date);
                date = dateTime.ToString("yyyy/MM/dd");            
            }
            report.ExitDate = date;
            report.Name = string.IsNullOrEmpty(name)? "###" : name ;
            report.ColorCode = string.IsNullOrEmpty(colorCode)? "#":colorCode;
            report.PalletBarcode = string.IsNullOrEmpty(palletBarcode)? "#":palletBarcode;
            report.Color = string.IsNullOrEmpty(color)? "#":color;
            report.PalletWeight = string.IsNullOrEmpty(palletWeight)? "#":palletWeight;
            report.YarnType = string.IsNullOrEmpty(yarnType)? "#":yarnType;
            report.Denier = string.IsNullOrEmpty(denier)? "#":denier;
            report.BoxesFirstSeries = new List<Box>();
            report.BoxesSecondSeries = new List<Box>();
            report.BoxesThirdSeries = new List<Box>();

            if(!string.IsNullOrEmpty(boxes)&& boxes.Contains(","))
            {
                var splitedBoxes = boxes.Split(",");
                
                for(var i=0;i<splitedBoxes.Length-2 && i<17 ;i=i+2){
                    var newBox = new Box();
                    newBox.Barcode = splitedBoxes[i];
                    newBox.Weight = double.Parse(splitedBoxes[i+1]);                    
                    report.BoxesFirstSeries.Add(newBox);                    
                }

                for(var i=18;i<splitedBoxes.Length-2 && i<27 ;i=i+2){
                    var newBox = new Box();
                    newBox.Barcode = splitedBoxes[i];
                    newBox.Weight = double.Parse(splitedBoxes[i+1]);                    
                    report.BoxesSecondSeries.Add(newBox);
                }

                for(var i=28;i<splitedBoxes.Length-2 ;i=i+2){
                    var newBox = new Box();
                    newBox.Barcode = splitedBoxes[i];
                    newBox.Weight = double.Parse(splitedBoxes[i+1]);                    
                    report.BoxesThirdSeries.Add(newBox);
                }
            }

            return View(report);
        }    
        public ActionResult Print(int invoiceId)
        {      
            var invoice = _context.Invoice.Include(p=>p.Customer).Include(p=>p.InvoicePallets).ThenInclude(p=>p.Pallet).Include(p=>p.InvoiceBoxes).ThenInclude(p=>p.Box).FirstOrDefault(p=>p.InvoiceId == invoiceId);
           var customerName = invoice.Customer.CustomerName;
            string remoteUri = "wwwroot";            
            var combinePdf = new PdfDocument();

            foreach(var pallet in invoice.InvoicePallets)
            {
                            
                var color = pallet.Pallet.Color;
                var colorCode = pallet.Pallet.ColorCode;
                var denier = $"{pallet.Pallet.Denier }/{pallet.Pallet.Filament}";
                var type = pallet.Pallet.YarnType;

                string command = $"python3 htmltopdf.py '{customerName}' '{color}' '{colorCode}' '{denier}' '{type}' '{pallet.Pallet.Barcode}' '{pallet.Weight}' '{pallet.PalletId}' '{invoice.InvoiceDate.ToString("yyyy/MM/dd")}' ' '";
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
                
            }

            foreach(var pallet in invoice.InvoicePallets)
            {
                var pdf =PdfReader.Open($"{remoteUri}/report-{pallet.PalletId}.pdf",PdfDocumentOpenMode.Import);
                CopyPages(pdf,combinePdf);                
            }
            
            var boxes = new List<Box>();
            foreach(var box in invoice.InvoiceBoxes)
            {
                boxes.Add(box.Box);
            }

            var pallets  = boxes.GroupBy(p=>p.PalletId,(key,g)=> new {PalletId = key,Boxes = g.ToList()});            
            var palletBoxIds = new List<string>();

            foreach(var pallet in pallets){
                var existingPallet = _context.Pallet.FirstOrDefault(p=>p.PalletId == pallet.PalletId );
                palletBoxIds.Add(existingPallet.PalletNumber);
                var firstBox = pallet.Boxes.FirstOrDefault();
                var color = firstBox.Color;
                var colorCode = firstBox.ColorCode;
                var denier = $"{firstBox.Denier }/{firstBox.Filament}";
                var type = firstBox.YarnType;
                var allBoxes = "";

                foreach(var box in pallet.Boxes){
                    if(string.IsNullOrEmpty(allBoxes))
                    {
                        allBoxes = $"{box.Barcode},{box.Weight}";
                    }
                    else
                    {
                        allBoxes = $"{allBoxes},{box.Barcode},{box.Weight}";
                    }
                }
                
                string command = $"python3 htmltopdf.py '{customerName}' '{color}' '{colorCode}' '{denier}' '{type}' '{existingPallet.Barcode}' '{existingPallet.Weight}' '{existingPallet.PalletNumber}' '{invoice.InvoiceDate.ToString("yyyy/MM/dd")}' '{allBoxes}'";
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
            
            }
                

            foreach(var palletId in palletBoxIds)
            {
                var pdf =PdfReader.Open($"{remoteUri}/report-{palletId}.pdf",PdfDocumentOpenMode.Import);
                CopyPages(pdf,combinePdf);                
            }

            var combinePdfName = $"{remoteUri}/exit-report-{invoice.InvoiceId}.pdf";

            combinePdf.Save(combinePdfName);

            combinePdf.Dispose();
            
            using (WebClient myWebClient = new WebClient())            
            {
                var file = myWebClient.DownloadData(combinePdfName);                
                return File(file, MediaTypeNames.Application.Pdf);    
            }       
        }             
      
        void CopyPages(PdfDocument from, PdfDocument to)
        {
            for (int i = 0; i < from.PageCount; i++)
            {
                to.AddPage(from.Pages[i]);
            }        
        }
            
    }
}