using System.Collections.Generic;
using static inventory.Pages.MainMenu;

namespace inventory.Models.DashboardViewModels
{
    public class GroupReport<T>{
        public string Key{get;set;}
        public IEnumerable<T> Elements{get;set;}
    }
     
}