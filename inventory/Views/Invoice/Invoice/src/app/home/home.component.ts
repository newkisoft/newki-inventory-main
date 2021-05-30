import { Component, OnInit } from "@angular/core";
import { Invoice } from "../Invoice";
import { Router,ActivatedRoute } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {filteredInvoices} from "../filter.pipe";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  invoices = new Array<Invoice>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  sortUp = new Array<boolean>();  
  totalPaid:number;
  totalDebt:number;
  syncing:boolean;
  isLoading = false;
  progress = "progress-bar progress-bar-striped progress-bar-animated w-0";
  progressPercent = 0;


  constructor(private http: HttpClient, private router: Router,private route:ActivatedRoute) {}

  ngOnInit() {
    var invoiceURL = "/api/Invoice/";
    this.isLoading = true;
    this.progressPercent = 25;
    this.searchText =this.route.snapshot.queryParamMap.get("search");
    this.http
      .get<Invoice[]>(invoiceURL)
      .toPromise()
      .then(res => {
        this.progressPercent = 90;
        this.invoices = res;
        this.calculateTotalWeight();
        this.progressPercent = 100;
        this.isLoading = false;
      })
      .catch( (error)=>{
        if(error.status == 200)
        {          
          window.location.href = window.location.origin+"/Account/login";
        }
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

  getColor(invoice:Invoice){
    var lira = invoice.TotalUsd * invoice.ExchangeRate;
    var isLira = false;

    var diffLira = invoice.Paid - lira;
    var diffUsd = invoice.Paid - invoice.TotalUsd;

    if(invoice.Currency === 'Lira' )
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

  getDifference(invoice){
    if(invoice.Currency === 'Usd' || !invoice.Currency )
    {
      return invoice.Paid - invoice.TotalUsd;
    }
    var diff = invoice.Paid/invoice.ExchangeRate - invoice.TotalUsd ;
    return diff;

    
  }
  calculateTotalWeight(){        
    this.totalPaid = 0;
    this.totalDebt = 0;
    var allInvoices = filteredInvoices;
    if(!filteredInvoices)
      allInvoices = this.invoices;
    for (var i = 0; i < allInvoices.length; i++) {     
      if(allInvoices[i].Currency === 'Usd' || !allInvoices[i].Currency){
        this.totalPaid += Number(allInvoices[i].Paid);        
      } else{
        var usd = allInvoices[i].Paid / allInvoices[i].ExchangeRate;
        this.totalPaid += usd;        
      }
      this.totalDebt += Number(allInvoices[i].TotalUsd);
    }
  }

  Sync(){
    this.syncing = true;
    var syncUrl = "/api/sync/StartInvoice";
    var syncProformaUrl = "/api/sync/GetWebsiteInvoices";
    this.http
    .get(syncUrl)
    .toPromise()
    .then(res => {
      this.syncing= false;
    });
    this.http
    .get(syncProformaUrl)
    .toPromise()
    .then(res => {
      this.syncing= false;
    });
  }

  Sort(sortHeader:string){        
    switch(sortHeader){
      case 'InvoiceId':
      {
        this.sortUp[0] = !this.sortUp[0];
        if(this.sortUp[0]){
          this.invoices.sort((a,b) => a.InvoiceId - b.InvoiceId);
        }else{
          this.invoices.sort((a,b) => b.InvoiceId - a.InvoiceId);
        }
        break;
      }
      case 'CustomerName':
      {
          this.sortUp[1] = !this.sortUp[1];
          if(this.sortUp[1]){
            this.invoices.sort((a,b) => a.Customer.CustomerName.toLocaleLowerCase().localeCompare(b.Customer.CustomerName.toLocaleLowerCase()));
          }else{
            this.invoices.sort((a,b) => b.Customer.CustomerName.toLocaleLowerCase().localeCompare(a.Customer.CustomerName.toLocaleLowerCase()));
          }          
          break;
      }
      
      case 'InvoiceDate':
      {
          this.sortUp[2] = !this.sortUp[2];
          if(this.sortUp[2]){
            this.invoices.sort((a,b) => a.InvoiceDate.localeCompare(b.InvoiceDate));
          }else{
            this.invoices.sort((a,b) => b.InvoiceDate.localeCompare(a.InvoiceDate));
          }
          break;
      }
      case 'TotalUsd':
      {
          this.sortUp[4] = !this.sortUp[4];
          if(this.sortUp[4]){
            this.invoices.sort((a,b) =>a.TotalUsd - b.TotalUsd);
          }else{
             this.invoices.sort((a,b) =>b.TotalUsd - a.TotalUsd);
          }
          break;
       }
       case 'Paid':
        {
            this.sortUp[5] = !this.sortUp[5];
            if(this.sortUp[5]){
              this.invoices.sort((a,b) =>a.Paid - b.Paid);
            }else{
               this.invoices.sort((a,b) =>b.Paid - a.Paid);
            }
            break;
         }
      }
    }
}
