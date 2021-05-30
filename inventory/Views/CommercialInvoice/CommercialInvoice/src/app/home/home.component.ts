import { Component, OnInit } from "@angular/core";
import { CommercialInvoice } from "../CommercialInvoice";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {filteredCommercialInvoices} from "../filter.pipe";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  CommercialInvoices = new Array<CommercialInvoice>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  sortUp = new Array<boolean>();  
  totalPaid:number;
  totalDebt:number;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    var CommercialInvoiceURL = "/api/CommercialInvoice/";
    this.http
      .get<CommercialInvoice[]>(CommercialInvoiceURL)
      .toPromise()
      .then(res => {
        this.CommercialInvoices = res;
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

  getColor(CommercialInvoice:CommercialInvoice){
    var lira = CommercialInvoice.TotalUsd * CommercialInvoice.ExchangeRate;
    var isLira = false;

    var diffLira = CommercialInvoice.Paid - lira;
    var diffUsd = CommercialInvoice.Paid - CommercialInvoice.TotalUsd;

    if(CommercialInvoice.Currency === 'Lira' )
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

  getDifference(CommercialInvoice){
    var lira = CommercialInvoice.TotalUsd * CommercialInvoice.ExchangeRate;    

    var diffLira = CommercialInvoice.Paid - lira;
    var diffUsd = CommercialInvoice.Paid - CommercialInvoice.TotalUsd;

    if(CommercialInvoice.Currency === 'Lira' )
      return diffLira;
    else
      return diffUsd;

  }
  calculateTotalWeight(){        
    this.totalPaid = 0;
    this.totalDebt = 0;
    var allCommercialInvoices = filteredCommercialInvoices;
    if(!filteredCommercialInvoices)
      allCommercialInvoices = this.CommercialInvoices;
    for (var i = 0; i < allCommercialInvoices.length; i++) {     
      if(allCommercialInvoices[i].Currency !== 'Lira' ){
        var lira = allCommercialInvoices[i].ExchangeRate * allCommercialInvoices[i].Paid;
        this.totalPaid += lira;
      } else{
        this.totalPaid += Number(allCommercialInvoices[i].Paid);        
      }
      this.totalDebt += Number(allCommercialInvoices[i].TotalUsd) * allCommercialInvoices[i].ExchangeRate ;
    }
  }

  Sort(sortHeader:string){        
    switch(sortHeader){
      case 'CommercialInvoiceId':
      {
        this.sortUp[0] = !this.sortUp[0];
        if(this.sortUp[0]){
          this.CommercialInvoices.sort((a,b) => a.CommercialInvoiceId - b.CommercialInvoiceId);
        }else{
          this.CommercialInvoices.sort((a,b) => b.CommercialInvoiceId - a.CommercialInvoiceId);
        }
        break;
      }
      case 'CustomerName':
      {
          this.sortUp[1] = !this.sortUp[1];
          if(this.sortUp[1]){
            this.CommercialInvoices.sort((a,b) => a.Customer.CustomerName.toLocaleLowerCase().localeCompare(b.Customer.CustomerName.toLocaleLowerCase()));
          }else{
            this.CommercialInvoices.sort((a,b) => b.Customer.CustomerName.toLocaleLowerCase().localeCompare(a.Customer.CustomerName.toLocaleLowerCase()));
          }          
          break;
      }
      
      case 'CommercialInvoiceDate':
      {
          this.sortUp[2] = !this.sortUp[2];
          if(this.sortUp[2]){
            this.CommercialInvoices.sort((a,b) => a.CommercialInvoiceDate.localeCompare(b.CommercialInvoiceDate));
          }else{
            this.CommercialInvoices.sort((a,b) => b.CommercialInvoiceDate.localeCompare(a.CommercialInvoiceDate));
          }
          break;
      }
      case 'TotalUsd':
      {
          this.sortUp[4] = !this.sortUp[4];
          if(this.sortUp[4]){
            this.CommercialInvoices.sort((a,b) =>a.TotalUsd - b.TotalUsd);
          }else{
             this.CommercialInvoices.sort((a,b) =>b.TotalUsd - a.TotalUsd);
          }
          break;
       }
       case 'Paid':
        {
            this.sortUp[5] = !this.sortUp[5];
            if(this.sortUp[5]){
              this.CommercialInvoices.sort((a,b) =>a.Paid - b.Paid);
            }else{
               this.CommercialInvoices.sort((a,b) =>b.Paid - a.Paid);
            }
            break;
         }
      }
    }
}
