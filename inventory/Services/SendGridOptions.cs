using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace inventory.Services
{
    public interface ISendGridOptions
    {
         string SendGridUser { get; set; }
         string SendGridKey { get; set; }
         string FromEmail { get; set; }
         string FromFullName { get; set; }
         bool IsDefault { get; set; }
    }
    public class SendGridOptions : ISendGridOptions
    {
        public string SendGridUser { get; set; }
        public string SendGridKey { get; set; }
        public string FromEmail { get; set; }
        public string FromFullName { get; set; }
        public bool IsDefault { get; set; }
    }
}
