using System.Collections.Generic;
using newkilibraries;

namespace inventory.Models.CommercialInvoiceReport
{
    public class CommercialInvoiceReport
    {        
        public int CommercialInvoiceId { get; set; }                
     
        public string CommercialInvoiceDate { get; set; }

        public string CommercialInvoiceDueDate { get; set; }
        
        public string Seller{get;set;}   
        public string Consignee{get;set;}
        public string Buyer{get;set;}
        public string ValidUntil{get;set;}
        public string CountryOfBeneficiary{get;set;}
        public string FreightForwarder{get;set;}
        public string CountryOfOrigin{get;set;}
        public string CountryOfDestination{get;set;}
        public string PartialShipment{get;set;}
        public string TermsOfDelivery{get;set;}
        public string RelevantLocation{get;set;}
        public string TransportBy{get;set;}
        public string Port{get;set;}
        public string TermsOfPayment{get;set;}
        public string HsCode{get;set;}
        public string PackageDescription{get;set;}
        public string TotalGross{get;set;}
        public string Size{get;set;}
        public string Currency{get;set;}
        
        public double TotalUsd{get;set;}
        
        public double Tax{get;set;}

        public double Kdv{get;set;}

        public double ExchangeRate{get;set;}
                
        public double Discount{get;set;}
        public string AmountInWords{get;set;}
        public string Header{get;set;}
        public string Footer{get;set;}
        public IList<Pallet> Pallets{get;set;}
        public IList<CommercialInvoiceExtra> Extras {get;set;}
    }
}
