import { Pipe, PipeTransform } from "@angular/core";
export var filteredplans:any[];
@Pipe({
  name: "filter"
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    filteredplans=[];
    searchText = searchText.toString().toLowerCase();
    return items.filter(it => {
      
      var res =  JSON.stringify(it)
        .toLowerCase()
        .includes(searchText);
        if(res)
        {
          filteredplans.push(it);
        }
        return res;
    });
  }
}
