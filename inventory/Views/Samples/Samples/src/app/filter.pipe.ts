import { Pipe, PipeTransform } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
export var filteredOrders:any[];
@Pipe({
  name: "filter"
})
export class FilterPipe implements PipeTransform {
  constructor(private router: Router, private route:ActivatedRoute) {
   
  }
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    filteredOrders=[];
    searchText = searchText.toString().toLowerCase();

    this.router.navigate([], {
      relativeTo: this.route ,
      queryParams: {
        search: searchText
      },
      queryParamsHandling: 'merge',      
      skipLocationChange: false      
    });

    return items.filter(it => {
      
      var res =  JSON.stringify(it)
        .toLowerCase()
        .includes(searchText);
        if(res)
        {
          filteredOrders.push(it);
        }
        return res;
    });
  }
}
