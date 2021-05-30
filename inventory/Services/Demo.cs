using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace inventory.Services
{
    public interface IDemo
    {
        bool IsDemo { get; set; }        
    }
    public class Demo :IDemo
    {
        public bool IsDemo { get; set; }   
    }
}
