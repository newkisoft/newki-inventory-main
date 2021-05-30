using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace inventory.Services
{
    public interface IDynamoDbConfig
    {
        string AccessKey{get;set;}
        string SecretKey{get;set;}
    }
     public class DynamoDbConfig:IDynamoDbConfig
    {
        public string AccessKey{get;set;}
        public string SecretKey{get;set;}
    }
}
