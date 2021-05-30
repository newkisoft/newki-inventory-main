import { Component, OnInit } from "@angular/core";
import { Proforma } from "../Proforma";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {filteredProformas} from "../filter.pipe";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  proformas = new Array<Proforma>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  sortUp = new Array<boolean>();  
  totalPaid:number;
  totalDebt:number;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    var proformaURL = "/api/Proforma/";
    this.http
      .get<Proforma[]>(proformaURL)
      .toPromise()
      .then(res => {
        this.proformas = res;
      });
  }

  doubleClick(event) {
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    //Navigate on double click
    this.router.navigate(["/edit/"], {
      queryParams: { id: event.currentTarget.children[0].innerText }
    });
  }

  getColor(proforma:Proforma){
    var lira = proforma.TotalUsd * proforma.ExchangeRate;
    var isLira = false;

    var diffLira = proforma.Paid - lira;
    var diffUsd = proforma.Paid - proforma.TotalUsd;

    if(proforma.Currency === 'Lira' )
      isLira = true;

    if(isLira===false){
      if(diffUsd < -1)
        return "red";  
      if(diffUsd > 1)    
        return "green";    
    }else{
      if(diffLira < -1)
        return "red";  
      if(diffLira > 1)
        return "green";
    }    
    return "";
  }

  getDifference(proforma){
    var lira = proforma.TotalUsd * proforma.ExchangeRate;    

    var diffLira = proforma.Paid - lira;
    var diffUsd = proforma.Paid - proforma.TotalUsd;

    if(proforma.Currency === 'Lira' )
      return diffLira;
    else
      return diffUsd;

  }
  calculateTotalWeight(){        
    this.totalPaid = 0;
    this.totalDebt = 0;
    var allProformas = filteredProformas;
    if(!filteredProformas)
      allProformas = this.proformas;
    for (var i = 0; i < allProformas.length; i++) {     
      if(allProformas[i].Currency !== 'Lira' ){
        var lira = allProformas[i].ExchangeRate * allProformas[i].Paid;
        this.totalPaid += lira;
      } else{
        this.totalPaid += Number(allProformas[i].Paid);        
      }
      this.totalDebt += Number(allProformas[i].TotalUsd) * allProformas[i].ExchangeRate ;
    }
  }

  Sort(sortHeader:string){        
    switch(sortHeader){
      case 'ProformaId':
      {
        this.sortUp[0] = !this.sortUp[0];
        if(this.sortUp[0]){
          this.proformas.sort((a,b) => a.ProformaId - b.ProformaId);
        }else{
          this.proformas.sort((a,b) => b.ProformaId - a.ProformaId);
        }
        break;
      }
      case 'CustomerName':
      {
          this.sortUp[1] = !this.sortUp[1];
          if(this.sortUp[1]){
            this.proformas.sort((a,b) => a.Customer.CustomerName.toLocaleLowerCase().localeCompare(b.Customer.CustomerName.toLocaleLowerCase()));
          }else{
            this.proformas.sort((a,b) => b.Customer.CustomerName.toLocaleLowerCase().localeCompare(a.Customer.CustomerName.toLocaleLowerCase()));
          }          
          break;
      }
      
      case 'ProformaDate':
      {
          this.sortUp[2] = !this.sortUp[2];
          if(this.sortUp[2]){
            this.proformas.sort((a,b) => a.ProformaDate.localeCompare(b.ProformaDate));
          }else{
            this.proformas.sort((a,b) => b.ProformaDate.localeCompare(a.ProformaDate));
          }
          break;
      }
      case 'TotalUsd':
      {
          this.sortUp[4] = !this.sortUp[4];
          if(this.sortUp[4]){
            this.proformas.sort((a,b) =>a.TotalUsd - b.TotalUsd);
          }else{
             this.proformas.sort((a,b) =>b.TotalUsd - a.TotalUsd);
          }
          break;
       }
       case 'Paid':
        {
            this.sortUp[5] = !this.sortUp[5];
            if(this.sortUp[5]){
              this.proformas.sort((a,b) =>a.Paid - b.Paid);
            }else{
               this.proformas.sort((a,b) =>b.Paid - a.Paid);
            }
            break;
         }
      }
    }
}
