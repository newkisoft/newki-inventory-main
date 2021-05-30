import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "filter"
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toString().toLowerCase();        
    var results = this.combinations(searchText.split(' '));

    return items.filter(it => {      
        var included = false;

        for(var i=0;i<results.length;i++)
        {
          var rr= JSON.stringify(it)
            .toLowerCase()
            .match(results[i]);
            if(rr!=null)
              included = rr.index>0;            
          if(included)
            return true;
        }
        return included;
    });
  }

  combinations(arg:string[]) {
    var results = new Array<string>();
    for(var i=0;i<arg.length;i++)  {
      var text = arg[i];
      for(var j=0;j<arg.length;j++){
        if(arg[i]!=arg[j]){
          text = text +".*"+ arg[j];
        }
      }
      results.push(text);
    }
    return results;    
  }  
}
