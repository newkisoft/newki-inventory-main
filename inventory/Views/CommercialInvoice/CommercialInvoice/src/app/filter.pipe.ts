import { Pipe, PipeTransform } from "@angular/core";
export var filteredCommercialInvoices:any[];
@Pipe({
  name: "filter"
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    filteredCommercialInvoices=[];
    searchText = searchText.toString().toLowerCase();
    return items.filter(it => {
      
      var res =  JSON.stringify(it)
        .toLowerCase()
        .includes(searchText);
        if(res)
        {
          filteredCommercialInvoices.push(it);
        }
        return res;
    });
  }
}
