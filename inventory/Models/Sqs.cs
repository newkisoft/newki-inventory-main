using inventory.Models.Attributes;

namespace inventory.Models
{
    public interface ISqsUrl
    {
        string PalletRequest{get;set;}
        string PalletResponse{get;set;}        
        string InvoiceRequest{get;set;}
        string InvoiceResponse{get;set;}    
        string PriceRequest{get;set;}
        string PriceResponse{get;set;}    
        string CustomerRequest{get;set;}
        string CustomerResponse{get;set;}    


    }
    public class SqsUrl :ISqsUrl
    {   
      public string PalletRequest{get;set;}
        public string PalletResponse{get;set;}
        public string InvoiceRequest { get;set;}
        public string InvoiceResponse { get;set; }
        public string PriceRequest{get;set;}
        public string PriceResponse{get;set;} 

        public string CustomerRequest{get;set;}
        public string CustomerResponse{get;set;}
    }
}
