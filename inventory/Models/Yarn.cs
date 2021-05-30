using inventory.Models.Attributes;

namespace inventory.Models
{
    public class Yarn
    {   
        [AwsRange]
        public string RequestNumber{get;set;}
        [AwsHash]
        public string Id{get;set;}
        public string Name{get;set;}
        public string Lustre{get;set;}
        public string Intermingle{get;set;}
        public string Color{get;set;}
        public string ColorCode{get;set;}              
        public string Price{get;set;}
        
    }
}
