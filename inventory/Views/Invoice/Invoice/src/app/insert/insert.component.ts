import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Invoice } from "../Invoice";
import { InvoicePallet } from "../InvoicePallet";
import { FormControl } from "@angular/forms";
import { Customer } from "../../../../../Customer/customers/src/app/Customer";
import { Pallet } from "../../../../../Pallet/pallet/src/app/pallet";
import {map, startWith} from 'rxjs/operators';
import {interval, Observable} from 'rxjs';
import { InvoiceBox } from '../InvoiceBox';
import { Box } from '../../../../../Box/Box/src/app/Box';
import { InvoicePayment } from "../InvoicePayment";
import { InvoiceDocumentFile } from "../InvoiceDocumentFile";
import { DocumentFile } from "../DocumentFile";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RequestStatus } from "../RequestStatus";

@Component({
  selector: "app-insert",
  templateUrl: "./insert.component.html",
  styleUrls: ["./insert.component.sass"]
})
export class InsertComponent implements OnInit {  
  showSuccess = false;
  showError = false;
  invoice = new Invoice();
  customers = new Array<Customer>();
  pallets = new Array<Pallet>();
  boxes = new Array<Box>();
  newPallet = new Pallet();
  newPalletId:number;
  invoicePallets = new Array<InvoicePallet>();  
  invoiceBoxes = new Array<InvoiceBox>();  
  ExchangeRate:number;
  ExternalExchangeRate:number;
  TotalUsd:number;
  TotalLira:number;
  Tax:number;
  form: FormGroup;
  uploading: boolean;
  exchangeApi:string;
  externalExchangeApi:string;
  filteredOptions: Observable<Pallet[]>;
  boxFilteredOptions: Observable<Box[]>;
  customerFilteredOptions: Observable<Customer[]>;
  files = new Array<InvoiceDocumentFile>();
  saving:boolean;
  showCustomers:boolean;
  searchText:string;
  days:Array<number>;
  errorCustomer:boolean;
  boxSearchText: string;
  palletSearchText: string;
  customerSearchText:string;
  boxSearchObserve = new Observable<string>();
  newInvoicePayment = new InvoicePayment();
  TotalSoldWeight: number;
  boxautocomplete = "list-group collapse hide";
  customerAutocomplete = "list-group collapse hide";
  palletAutocomplete = "list-group collapse hide";
  NumberOfBoxes = 0;
  NumberOfPallets = 0;
  showCamera = false;


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
    var palletUrl = "/api/Pallet/";
    var boxUrl = "/api/Box/";
    this.exchangeApi = "/api/exchange/";    
    this.externalExchangeApi = "/api/exchange/Get/latest/try/usd";
    this.errorCustomer = false;
    
    this.newInvoicePayment.Amount =0;
    this.newInvoicePayment.ExchangeRate = 0;
    this.newInvoicePayment.PaymentDate = new Date();
    this.invoice.Kdv = 8;
    this.TotalUsd = 0;
    this.TotalSoldWeight = 0;
    this.TotalLira = 0;
    this.ExchangeRate = 5.7;
    this.ExternalExchangeRate = 0;  
    

    this.http.get<any>(customerUrl)
    .subscribe(p => {
      this.customers = p;      
    });

    this.http      
    .post<Pallet[]>(palletUrl + "search/" , ["false"] )
    .toPromise()
    .then(res => {
      this.pallets = res;
    });

    this.http      
    .post<Box[]>(boxUrl + "search/" , ["false"] )
    .toPromise()
    .then(res => {
      this.boxes = res;
     
    });

    this.http.get<any>(this.exchangeApi)
    .subscribe(p => {
      this.ExchangeRate = p;
      this.newInvoicePayment.ExchangeRate = this.ExchangeRate;
    });    

    this.http.get<any>(this.externalExchangeApi)
    .subscribe(p => {
      this.ExternalExchangeRate = p;
    });    

    this.invoice.Kdv = 8;   
    this.invoice.Discount = 0; 
    this.TotalUsd = 0;
    this.TotalLira = 0;
    this.ExchangeRate = 5.7;
    this.invoice.Paid = 0;
    ;
    this.invoice.InvoiceDate = (new Date()).toISOString();
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
    newInvoiceBox.Box.IsDelivered = true;
    newInvoiceBox.Box.DeliveryDate = new Date();
    newInvoiceBox.InvoiceId = this.invoice.InvoiceId;
    newInvoiceBox.Invoice = this.invoice;
    newInvoiceBox.Weight = selectedBox.RemainWeight;
    this.invoiceBoxes.push(newInvoiceBox);
    this.boxautocomplete = "list-group collapse hide";
    this.boxSearchText = "";
    this.RemoveSearchBoxItem(selectedBox);
    this.Calculate();    
  }


  AddPallet(newPalletId:number){
    var selectedPallet = this.pallets.find( p=>p.PalletId == newPalletId);
    var newInvoicePallet = new InvoicePallet();
    newInvoicePallet.PalletId = selectedPallet.PalletId;
    newInvoicePallet.Pallet = selectedPallet;
    newInvoicePallet.Pallet.IsDelivered = true;
    newInvoicePallet.Pallet.DeliveryDate = new Date();
    newInvoicePallet.InvoiceId = this.invoice.InvoiceId;
    newInvoicePallet.Invoice = this.invoice;
    newInvoicePallet.Weight = selectedPallet.RemainWeight;
    this.invoicePallets.push(newInvoicePallet);
    this.palletAutocomplete = "list-group collapse hide";
    this.palletSearchText = "";
    this.RemoveSearchPalletItem(selectedPallet);
    this.Calculate();    
  }

  AddCustomer(newCustomerId:number){
    this.invoice.Customer = this.customers.find( p=>p.CustomerId == newCustomerId);
    this.customerAutocomplete = "list-group collapse hide";
    this.customerSearchText = this.invoice.Customer.CustomerName;
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

  RemoveSearchPalletItem(selectedPallet:Pallet)
  {    
    const index: number = this.pallets.indexOf(selectedPallet);
    if (index !== -1) {
        this.pallets.splice(index, 1);
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
    if(invoice.Customer == null)
      return;
    this.Calculate();
    this.showSuccess = false;
    this.saving = true;
    var invoiceURL = "/api/Invoice/Insert";
    var checkSaved = "/api/Invoice/CheckInvoiceInserted";
    this.invoice.InvoicePallets = new Array<InvoicePallet>();
    for (var i = 0; i < this.invoicePallets.length; i++) {
      var invoicePallet = new InvoicePallet();
      invoicePallet.InvoiceId = this.invoice.InvoiceId;
      invoicePallet.PalletId = this.invoicePallets[i].PalletId;
      invoicePallet.Weight = this.invoicePallets[i].Weight;
      invoicePallet.Pallet = this.invoicePallets[i].Pallet;
      invoice.InvoicePallets.push(invoicePallet);
    }

    this.invoice.InvoiceBoxes = new Array<InvoiceBox>();
    for (var i = 0; i < this.invoiceBoxes.length; i++) {
      var invoiceBox = new InvoiceBox();
      invoiceBox.InvoiceId = this.invoice.InvoiceId;
      invoiceBox.BoxId = this.invoiceBoxes[i].BoxId;
      invoiceBox.Weight = this.invoiceBoxes[i].Weight;
      invoiceBox.Box = this.invoiceBoxes[i].Box;
      invoice.InvoiceBoxes.push(invoiceBox);
    }

    this.invoice.Files = new Array<InvoiceDocumentFile>();
    for (var i = 0; i < this.files.length; i++) {
      var file = new InvoiceDocumentFile();
      file.InvoiceId = this.invoice.InvoiceId;
      file.DocumentFileId = this.files[i].DocumentFileId;
      file.File = new DocumentFile();
      file.File.FileName = this.files[i].File.FileName;
      this.invoice.Files.push(file);
    }
    
    invoice.TotalUsd = this.TotalUsd;
    invoice.Currency = "Usd";
    invoice.Tax = this.Tax;
    invoice.ExchangeRate = this.ExchangeRate;

    this.http
      .post<string>(invoiceURL, invoice)
      .toPromise()
      .then(res => {
        var cnt =0;
        var insertCheck = interval(5000).subscribe((val) => { 
          var request= new RequestStatus();
          request.Id = res;
            this.http
            .post<RequestStatus>(checkSaved, request)
            .toPromise()
            .then(res => {
              cnt++;
              if(res.Status !="" || cnt>6)
              {
                if(cnt<7)
                {
                  this.showSuccess = true;                
                  this.saving = false;
                  this.router.navigate(['/edit'],{queryParams: {id: res.Status}});
                }else
                {
                  this.showError = true;
                  this.saving = false;                  
                }
                insertCheck.unsubscribe();                
              }
            });
          });
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
  palletSearchChange() {
    if(this.palletSearchText.length<1){
      this.palletAutocomplete = "list-group collapse hide";
     }else{
      this.palletAutocomplete = "list-group collapse show";
      if(this.palletSearchText.length >= 26)
      {
        var cnt=0;
        this.pallets.forEach(p=>{
          if(this.palletSearchText.includes(p.Barcode))
          {
            this.AddPallet(p.PalletId);
            cnt++;
          }
        });
        this.palletSearchText = '';        
      }
     }
  }

  OnUploadFile() {
    this.form.value.fatura.filename = "inv-0-" + this.form.value.fatura.filename
    const formModel = this.form.value.fatura;
    this.uploading = true;
    var invoiceUrl = '/api/AwsStorage/UploadFile/';

    this.http
      .post(invoiceUrl, formModel)
      .toPromise()
      .then(() => {
        var newInvoiceFile = new InvoiceDocumentFile();
        newInvoiceFile.InvoiceId = 0;
        var newFile = new DocumentFile();
        newFile.FileName = this.form.value.fatura.filename;
        newInvoiceFile.File = newFile;
        this.files.push(newInvoiceFile);
        this.uploading = false;
      });

  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('fatura').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result
        })
      };
    }
  }


  RemoveFileItem(selectedFile: InvoiceDocumentFile) {
    const index: number = this.files.indexOf(selectedFile);
    if (index !== -1) {
      this.files.splice(index, 1);
    }
  }
  customerSearchChange() {
      this.customerAutocomplete = "list-group collapse show";      
  }
  AddPayment() {
    if(this.invoice.Payments==null)
      this.invoice.Payments = new Array<InvoicePayment>();   
   
    var newInvoicePayment = new InvoicePayment();
    newInvoicePayment.Amount = this.newInvoicePayment.Amount;
    newInvoicePayment.ExchangeRate = this.newInvoicePayment.ExchangeRate;
    newInvoicePayment.PaymentDate = this.newInvoicePayment.PaymentDate;
    this.invoice.Payments.push(newInvoicePayment);
    this.invoice.Paid = this.invoice.Paid + this.newInvoicePayment.Amount / this.newInvoicePayment.ExchangeRate;
    this.newInvoicePayment = new InvoicePayment();
    this.newInvoicePayment.ExchangeRate = this.ExchangeRate;
  }

  RemovePayment(selectedInvoice:InvoicePayment)
  {
    const index: number = this.invoice.Payments.indexOf(selectedInvoice);
    if (index !== -1) {
      this.invoice.Payments.splice(index, 1);
      this.invoice.Paid = this.invoice.Paid - selectedInvoice.Amount / selectedInvoice.ExchangeRate;
    }
  }
}
