import { Component, OnInit } from '@angular/core';
import { Vendor } from '../../../../../Vendor/Vendors/src/app/Vendor';
import { Bill } from '../bill';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.sass']
})
export class InsertComponent implements OnInit {
  bill = new Bill();
  
  showSuccess = false;
  showError = false;
  myControl = new FormControl();
  VendorsControl = new FormControl();
  vendors = new Array<Vendor>();
  filteredOptions: Observable<Vendor[]>;
  saving = false;
  exchangeApi ="";
  errorVendor = false;
  vendorSearchText:string;
  vendorAutocomplete = "list-group collapse hide";
  externalExchangeApi: string;
  selectedCurrency="TRY";
  currencies=["TRY","USD","EUR"];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bill.Vendor = new Vendor();
    this.bill.Amount =0;
    this.bill.BillDueDate = new Date();
    this.bill.Paid=0;
    this.bill.ExchangeRate = 6.5;
    this.bill.KDV =0;    
  }

  ngOnInit() {

    var vendorUrl = "/api/Vendor/";    
    this.exchangeApi = "/api/exchange/";  
    this.externalExchangeApi = "/api/exchange/Get/latest/";

    if(this.route.snapshot.queryParams["amount"]){
      this.bill.Amount =  Number.parseFloat(this.route.snapshot.queryParamMap.get("amount"));
      this.bill.Paid =  this.bill.Amount;
    }
    if(this.route.snapshot.queryParams["date"]){
      var date = this.route.snapshot.queryParamMap.get("date").replace(" ","+");
      this.bill.BillDate = new Date(date);
    }
    if(this.route.snapshot.queryParams["description"]){
      this.bill.BillName = this.route.snapshot.queryParamMap.get("description");    
      this.bill.Comment = this.route.snapshot.queryParamMap.get("description");
      this.vendorSearchText = this.fetchVendorFromText(this.bill.Comment);       
      for(let vendor of this.vendors)
      {
        if(vendor.VendorName == this.vendorSearchText)
        {
          this.AddVendor(vendor.VendorId);
          return;
        }
      }
    }

    this.http.get<any>(this.exchangeApi)
    .subscribe(p => {
      this.bill.ExchangeRate = p;
    });


    this.http.get<any>(vendorUrl)
    .subscribe(p => {
      this.vendors = p;
      this.filteredOptions = this.VendorsControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });


   
  }

  Save(bill: Bill) {
    this.showSuccess = false;
    var billUrl = "/api/Bill/Insert";
    if(!bill.Vendor || !bill.Vendor.VendorName)
    {
      this.errorVendor = true;
      this.saving = false;
      return;
    }else{
      this.errorVendor = false;
    }
    this.saving = true;
    
    this.http
      .post<Bill>(billUrl, bill)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  UpdateVendor(option:Vendor){
    this.bill.Vendor = option;
  }

  AddVendor(newVendorId:number){
    this.bill.Vendor = this.vendors.find( p=>p.VendorId == newVendorId);
    this.vendorAutocomplete = "list-group collapse hide";
    this.vendorSearchText = this.bill.Vendor.VendorName;
  }
  
  vendorSearchChange() {
    this.vendorAutocomplete = "list-group collapse show";      
  }

  fetchVendorFromText(description:string)
  {
    var vendor = "";
    var splitedText = description.replace("\"","").split("-");
    if(splitedText.length>0)    
    {
      vendor = splitedText[splitedText.length-1];
    }
    return vendor;
  }
  
  Cancel() {
    this.router.navigateByUrl("/home");
  }

  SelectCurrencty(currency:string)
  {
    this.selectedCurrency = currency;
    
    var url = currency == "TRY" ? this.exchangeApi :this.externalExchangeApi + currency+"/usd";

    this.http.get<any>(url)
    .subscribe(p => {
      this.bill.ExchangeRate = p;
    });
  }

  private _filter(value: string): Vendor[] {
    const filterValue = value.toString().toLowerCase();

    return this.vendors.filter(option => option.VendorName.toLowerCase().includes(filterValue));
  }

}
