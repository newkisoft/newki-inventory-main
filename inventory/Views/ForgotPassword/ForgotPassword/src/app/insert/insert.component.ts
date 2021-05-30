import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Invoice } from "../Invoice";
import { InvoicePallet } from "../InvoicePallet";
import { FormControl } from "@angular/forms";
import { Customer } from "../../../../../Customer/customers/src/app/Customer";
import { Pallet } from "../../../../../Pallet/pallet/src/app/pallet";
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { InvoiceBox } from '../InvoiceBox';
import { Box } from '../../../../../Box/Box/src/app/Box';

@Component({
  selector: "app-insert",
  templateUrl: "./insert.component.html",
  styleUrls: ["./insert.component.sass"]
})
export class InsertComponent implements OnInit {  
  showSuccess = false;
  showError = false;
  CustomerControl = new FormControl();
  PalletsControl = new FormControl();
  BoxesControl = new FormControl();
  invoice = new Invoice();
  customers = new Array<Customer>();
  pallets = new Array<Pallet>();
  boxes = new Array<Box>();
  newPallet = new Pallet();
  newPalletId:number;
  invoicePallets = new Array<InvoicePallet>();  
  invoiceBoxes = new Array<InvoiceBox>();  
  ExchangeRate:number;
  TotalUsd:number;
  TotalLira:number;
  Tax:number;
  exchangeApi:string;
  filteredOptions: Observable<Pallet[]>;
  boxFilteredOptions: Observable<Box[]>;
  customerFilteredOptions: Observable<Customer[]>;
  saving:boolean;
  showCustomers:boolean;
  searchText:string;
  days:Array<number>;
  errorCustomer:boolean;
  boxSearchText: string;
  boxSearchObserve = new Observable<string>();
  boxautocomplete = "list-group collapse hide";


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.invoice.Customer = new Customer();
    this.invoice.InvoicePallets = new Array<InvoicePallet>();  
    this.invoice.InvoiceBoxes = new Array<InvoiceBox>();  
  }

  ngOnInit() {

    var customerUrl = "/api/Customer/";
    var palletUrl = "/api/Pallet/GetAvailablePallets";
    var boxUrl = "/api/Box/GetAvailableBoxes";
    this.exchangeApi = "/api/exchange/";    
    this.errorCustomer = false;
    

    this.http.get<any>(customerUrl)
    .subscribe(p => {
      this.customers = p.Items;
      this.customerFilteredOptions = this.CustomerControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._customerFilter(value))
      );
    });

    this.http.get<any>(palletUrl)
    .subscribe(p => {
      this.pallets = p.Items;
      this.filteredOptions = this.PalletsControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      ); 
    });

    this.http.get<any>(boxUrl)
    .subscribe(p => {
      this.boxes = p.Items;
      this.boxFilteredOptions = this.BoxesControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._boxFilter(value))
      ); 
    });

    this.http.get<any>(this.exchangeApi)
    .subscribe(p => {
      this.ExchangeRate = p;
    });    
    this.invoice.Kdv = 8;   
    this.invoice.Discount = 0; 
    this.TotalUsd = 0;
    this.TotalLira = 0;
    this.ExchangeRate = 5.7;
    ;
    this.invoice.InvoiceDate = (new Date()).toISOString();
  }

  Add(newPalletId:number){
    var selectedPallet = this.pallets.find( p=>p.PalletId == newPalletId);
    var newInvoicePallet = new InvoicePallet();
    newInvoicePallet.PalletId = selectedPallet.PalletId;
    newInvoicePallet.Pallet = selectedPallet;
    newInvoicePallet.InvoiceId = this.invoice.InvoiceId;
    newInvoicePallet.Invoice = this.invoice;
    newInvoicePallet.Weight = selectedPallet.RemainWeight;
    this.invoicePallets.push(newInvoicePallet);
    this.Calculate();    
    const index: number = this.pallets.indexOf(selectedPallet);
    if (index !== -1) {
      this.pallets.splice(index, 1);
    }
  }

  RemoveItem(selectedPallet:InvoicePallet)
  {    
    const index: number = this.invoicePallets.indexOf(selectedPallet);
    if (index !== -1) {
        this.invoicePallets.splice(index, 1);
    }           
    this.Calculate();
    this.pallets.push(selectedPallet.Pallet);
  }

  AddBox(newBoxId:number){
    var selectedBox = this.boxes.find( p=>p.BoxId == newBoxId);
    var newInvoiceBox = new InvoiceBox();
    newInvoiceBox.BoxId = selectedBox.BoxId;
    newInvoiceBox.Box = selectedBox;
    newInvoiceBox.InvoiceId = this.invoice.InvoiceId;
    newInvoiceBox.Invoice = this.invoice;
    newInvoiceBox.Weight = selectedBox.RemainWeight;
    this.invoiceBoxes.push(newInvoiceBox);
    this.boxautocomplete = "list-group collapse hide";
    this.boxSearchText = "";
    this.RemoveSearchBoxItem(selectedBox);
    this.Calculate();    
  }

  RemoveBoxItem(selectedBox:InvoiceBox)
  {    
    const index: number = this.invoiceBoxes.indexOf(selectedBox);
    if (index !== -1) {
        this.invoiceBoxes.splice(index, 1);
    }           
    this.Calculate();
  }

  RemoveSearchBoxItem(selectedBox:Box)
  {    
    const index: number = this.boxes.indexOf(selectedBox);
    if (index !== -1) {
        this.boxes.splice(index, 1);
    }               
  }

 
  Calculate(){
    this.TotalUsd = 0;
    
    for(var i=0;i<this.invoicePallets.length;i++){ 
      var weight = this.invoicePallets[i].Weight;   
      this.TotalUsd = weight * this.invoicePallets[i].Pallet.Price + this.TotalUsd;
    }

    for(var i=0;i<this.invoiceBoxes.length;i++){ 
      var weight = this.invoiceBoxes[i].Weight;   
      this.TotalUsd = weight * this.invoiceBoxes[i].Box.Price + this.TotalUsd;
    }

    this.TotalUsd = this.TotalUsd - this.invoice.Discount;
    
    this.TotalUsd = Math.round(this.TotalUsd * 1000)/1000;
    this.Tax = this.TotalUsd * this.invoice.Kdv /100;
    this.Tax = Math.round(this.Tax * 1000)/1000;
    this.TotalUsd = this.TotalUsd + this.Tax;
    this.TotalLira = this.TotalUsd  * this.ExchangeRate;
    this.TotalLira = Math.round(this.TotalLira * 1000)/1000;    

  }


  private _filter(value: string): Pallet[] {
    const filterValue = value.toString().toLowerCase();

    return this.pallets.filter(
      option => option.PalletNumber.toString().includes(filterValue) ||
        option.YarnType.includes(filterValue) ||
        option.Barcode.includes(filterValue) ||
        option.Weight.toString().includes(filterValue) ||
        option.Denier.toString().includes(filterValue) ||
        option.Filament.toString().includes(filterValue));
  }

  private _boxFilter(value: string): Box[] {
    var filterValue = value.toString().toLowerCase();
    if(!value)
      filterValue = "";

    return this.boxes.filter(option => option.Barcode.toString().includes(filterValue)||
    option.YarnType.includes(filterValue) ||
    option.Denier.toString().includes(filterValue)||
    option.Filament.toString().includes(filterValue)  );
  }


  private _customerFilter(value: string): Customer[] {
    const filterValue = value.toString().toLowerCase();
    return this.customers.filter(option => option.CustomerName.toLocaleLowerCase().includes(filterValue));
  }

  Save(invoice: Invoice) {
    this.saving = true;
    this.Calculate();
    this.showSuccess = false;
    var invoiceURL = "/api/Invoice/Insert";    
    invoice.InvoicePallets = new Array<InvoicePallet>();
    if(!invoice.Customer || !invoice.Customer.CustomerName)
    {
      this.errorCustomer = true;
      this.saving = false;
      return;
    }else{
      this.errorCustomer = false;
    }
    for(var i=0;i<this.invoicePallets.length;i++){
      var invoicePallet = new InvoicePallet();      
      invoicePallet.PalletId = this.invoicePallets[i].PalletId;
      invoicePallet.Weight = this.invoicePallets[i].Weight;      
      invoicePallet.Pallet = this.invoicePallets[i].Pallet;            
      invoicePallet.Invoice = new Invoice();
      invoicePallet.InvoiceId = 0;            
      invoice.InvoicePallets.push(invoicePallet);
    }        

    for(var i=0;i<this.invoiceBoxes.length;i++){
      var invoiceBox = new InvoiceBox();      
      invoiceBox.BoxId = this.invoiceBoxes[i].BoxId;
      invoiceBox.Weight = this.invoiceBoxes[i].Weight;      
      invoiceBox.Box = this.invoiceBoxes[i].Box;
      invoiceBox.Invoice = new Invoice();
      invoiceBox.InvoiceId = 0;      
      invoice.InvoiceBoxes.push(invoiceBox);
    } 
    
    invoice.InvoiceId = 0;
    invoice.ExchangeRate = this.ExchangeRate;
    invoice.TotalUsd = this.TotalUsd;
    invoice.Tax = this.Tax;        
    invoice.InvoiceDueDate = invoice.InvoiceDate;    
    
    this.http
      .post<Invoice>(invoiceURL, invoice)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  UpdateCustomer(option:Customer){
    this.invoice.Customer = option;
  }

  SelectCustomer(option:Customer){
    this.invoice.Customer = option;
  }

  SelectDate(option:string){    
    this.invoice.InvoiceDate = option;
  }

  ToggleShowCustomers(){
    this.showCustomers = !this.showCustomers;
  }
  
  Cancel() {
    this.router.navigateByUrl("/home");
  }
  searchChange() {
    if(this.boxSearchText.length<1){
      this.boxautocomplete = "list-group collapse hide";
     }else{
      this.boxautocomplete = "list-group collapse show";
      if(this.boxSearchText.length >= 26)
      {
        var cnt=0;
        this.boxes.forEach(p=>{
          if(this.boxSearchText.includes(p.Barcode))
          {
            this.AddBox(p.BoxId);
            cnt++;
          }
        });
        this.boxSearchText = '';        
      }
     }
  }
}
