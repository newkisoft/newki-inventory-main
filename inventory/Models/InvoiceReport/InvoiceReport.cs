using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using newkilibraries;

namespace inventory.Models.InvoiceReport
{
    public class InvoiceReport
    {
        [Display(Name = "Invoice Number")]
        public int InvoiceId { get; set; }
                
        [Display(Name = "Invoice Date")]
        public string InvoiceDate { get; set; }
        [Display(Name = "Invoice Due Date")]
        public string InvoiceDueDate { get; set; }

        [Display(Name = "Customer")]
        public Customer Customer{get;set;}       

        [Display(Name = "Products")]
        public IList<InvoicePallet> InvoicePallets{get;set;}
        public IList<InvoiceBox> InvoiceBoxes{get;set;}

        [Display(Name = "TotalUsd")]
        public double TotalUsd{get;set;}

        [Display(Name = "Tax")]
        public double Tax{get;set;}

        public double Kdv{get;set;}

        [Display(Name = "Exchange Rate")]
        public double ExchangeRate{get;set;}

        public int StateInvoiceNumber{get;set;}
        
        public double Discount{get;set;}
        public string AmountInWords{get;set;}
        public double TotalWeight{get;set;}
    }
}
