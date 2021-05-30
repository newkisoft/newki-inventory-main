import { Pipe, PipeTransform } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';

export var filteredPallets:any[];
@Pipe({
  name: "filter"
})
export class FilterPipe implements PipeTransform {    
  constructor(private router: Router, private route:ActivatedRoute) {
    
  }
  

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toString().toLowerCase().trim().replace(/\s\s+/g, ' ');        
    var sortedSearchText = this.sort(searchText);
    filteredPallets=[];

    
    this.router.navigate([], {
      relativeTo: this.route ,
      queryParams: {
        search: searchText
      },
      queryParamsHandling: 'merge',      
      skipLocationChange: false      
    });

    return items.filter(it => {      
        var included = false;

          var sortItemText= this.sort(this.cleanText(JSON.stringify(it))
            .toLowerCase());
          var rr = sortItemText.match(sortedSearchText+".*");
          if(rr!=null)
              included = rr.index>0;            
          if(included)
          {
            filteredPallets.push(it);
            return true;
          }
        return included;
    });
  }

  sort(text:string):string{    
     return text.split(' ').sort().join('.*');
  }

  cleanText(str:string):string{
    return str.replace(/"\w+":/g, '').replace(/"/g,'').replace(/}/g,'').replace(/{/g,'').replace(/,/g,' ');
  }
}
