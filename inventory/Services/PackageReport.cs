using System.Collections.Generic;
using System.Text.Json;
using inventory.Data;
using inventory.Models.ProformaReport;
using Microsoft.EntityFrameworkCore;
using newkilibraries;
using System.Linq;

namespace inventory.Services
{
    public interface IPackageReport
    {
        public ProformaReport Get(int id);
    }
    public class PackageReport:IPackageReport
    {
        private readonly ApplicationDbContext _context;

        public PackageReport(IDbContext context){
            _context = (ApplicationDbContext)context;
        }

        public ProformaReport Get(int id)
        {
            var proformaReport = new ProformaReport();  
            var commercialInvoice = _context.CommercialInvoice.FirstOrDefault(p=>p.CommercialInvoiceId == id);            
            var invoice = _context.Invoice
                                        .Include(p=>p.InvoicePallets)
                                        .ThenInclude(p=>p.Pallet)
                                        .Include(p=>p.InvoiceBoxes)
                                        .ThenInclude(p=>p.Box)
                                        .FirstOrDefault(p=>p.InvoiceId == commercialInvoice.InvoiceId);
            
            var letterhead =  _context.Setting.FirstOrDefault(p=>p.Key=="Letterhead");
            var headers = letterhead!=null? JsonSerializer.Deserialize<List<string>>(letterhead.Value):null;

            proformaReport.ProformaDate = commercialInvoice.CommercialInvoiceDate.ToString("dd/MM/yyyy");
            proformaReport.TotalUsd = commercialInvoice.TotalUsd;
            proformaReport.ExchangeRate = commercialInvoice.ExchangeRate;
            proformaReport.Tax = commercialInvoice.Tax;
            proformaReport.Kdv = commercialInvoice.Kdv;     
            proformaReport.Seller = commercialInvoice.Seller;       
            proformaReport.Buyer = commercialInvoice.Buyer;
            proformaReport.Consignee = commercialInvoice.Consignee;
            proformaReport.CountryOfBeneficiary = commercialInvoice.CountryOfBeneficiary;
            proformaReport.CountryOfDestination = commercialInvoice.CountryOfDestination;
            proformaReport.CountryOfOrigin = commercialInvoice.CountryOfOrigin;
            proformaReport.HsCode = commercialInvoice.HsCode;
            proformaReport.PackageDescription = commercialInvoice.PackageDescription;
            proformaReport.FreightForwarder = commercialInvoice.FreightForwarder;
            proformaReport.PartialShipment = commercialInvoice.PartialShipment;
            proformaReport.RelevantLocation = commercialInvoice.RelevantLocation;
            proformaReport.Size = commercialInvoice.Size;
            proformaReport.Port = commercialInvoice.Port;
            proformaReport.TermsOfDelivery = commercialInvoice.TermsOfDelivery;
            proformaReport.TermsOfPayment = commercialInvoice.TermsOfPayment;
            proformaReport.TotalGross = commercialInvoice.TotalGross;
            proformaReport.TransportBy = commercialInvoice.TransportBy;
            proformaReport.Currency = commercialInvoice.Currency!=null && commercialInvoice.Currency=="Euro"? commercialInvoice.Currency.ToLower():"dollar";
            proformaReport.ValidUntil = commercialInvoice.CommercialInvoiceDueDate.ToString("dd/MM/yyyy");
            proformaReport.ProformaId = invoice.InvoiceId;

            proformaReport.ProformaProformaItems = new List<ProformaProformaItem>();
            proformaReport.Pallets = new List<Pallet>();

            foreach(var pallet in invoice.InvoicePallets.OrderBy(p=>p.Pallet.ColorCode))
            {
                var proformaItem = new ProformaProformaItem();
                proformaItem.ProformaItem = new ProformaItem{
                    Description = $"{pallet.Pallet.YarnType} {pallet.Pallet.Denier}/{pallet.Pallet.Filament} {pallet.Pallet.Color}-{pallet.Pallet.ColorCode}",                

                };
                proformaItem.Weight = pallet.Weight;
                proformaReport.ProformaProformaItems.Add(proformaItem);  
                proformaReport.Pallets.Add(pallet.Pallet);
            }
            if(headers !=null)
            {
                proformaReport.Header = headers[0];
                proformaReport.Footer =headers.Count>1? headers[1]:"";
            }
            return proformaReport;
        }
    }
}