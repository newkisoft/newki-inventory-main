using inventory.Models.Attributes;

namespace inventory.Models
{
    public class CatalogueColor
    {   
        [AwsRange]
        public string ColorCode{get;set;}
        [AwsHash]
        public string Id{get;set;}
        public string Catalogue{get;set;}
        public string PageNumber{get;set;}
        public string Color{get;set;}
        public string Comment{get;set;}        
    }
}
