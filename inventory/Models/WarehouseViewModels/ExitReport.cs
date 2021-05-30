using System.Collections.Generic;
using newkilibraries;

namespace inventory.Models.WarehouseViewModels
{
    public class ExitReport
    {
        public string ExitDate{get;set;}
        public string Name{get;set;}      
        public string Color{get;set;}
        public string ColorCode{get;set;}
        public string Denier{get;set;}
        public string PalletBarcode{get;set;}
        public string PalletWeight{get;set;}
        public string YarnType{get;set;}
        public List<Box> BoxesFirstSeries{get;set;}
        public List<Box> BoxesSecondSeries{get;set;}
        public List<Box> BoxesThirdSeries{get;set;}
    }
}
