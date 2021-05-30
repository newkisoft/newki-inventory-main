import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Proforma } from "../Proforma";
import { FormControl } from "@angular/forms";
import { Customer } from "../../../../../Customer/customers/src/app/Customer";
import { Observable, observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ProformaProformaItem } from '../ProformaProformaItem';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { DocumentFile } from '../DocumentFile';
import { ProformaDocumentFile } from '../ProformaDocumentFile';
import { ProformaItem } from '../../../../../ProformaItem/ProformaItem/src/app/ProformaItem';
import { filteredProformas } from "../filter.pipe";

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.sass']
})
export class InsertComponent implements OnInit {

  proforma = new Proforma();
  showSuccess = false;
  showError = false;
  CustomerControl = new FormControl();
  PalletsControl = new FormControl();
  BoxesControl = new FormControl();
  customers = new Array<Customer>();
  ProformaItems = new Array<ProformaItem>();
  newProformaItem = new ProformaItem();
  newProformaItemId:number;
  proformaProformaItems = new Array<ProformaProformaItem>();    
  ExchangeRate:number;
  TotalUsd:number;
  TotalLira:number;
  Tax:number;
  ProformaReportUrl:string;
  ExitReportUrl:string;
  filteredOptions: Observable<ProformaItem[]>;  
  customerFilteredOptions: Observable<Customer[]>;
  form: FormGroup;
  uploading: boolean;
  exitReporting:boolean;
  generatingPdf:boolean;
  saving:boolean;
  files = new Array<ProformaDocumentFile>();  
  id:string;
  errorCustomer:boolean;
  filteredProformas = new Array<ProformaItem>();
  searchText: string;
  searchObserve = new Observable<string>();
  autocomplete = "list-group collapse hide";
  customerAutocomplete = "list-group collapse hide";
  customerSearchText:string;
  exchangeApi:string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.proforma.Customer = new Customer();    
    this.proforma.Kdv = 8;
    this.TotalUsd = 0;
    this.TotalLira = 0;
    this.proforma.Discount =0;
    this.proforma.Paid =0 ;
    this.ExchangeRate = 5.7;
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      fatura: null
    });
  }

  ngOnInit() {

    var customerUrl = "/api/Customer/";
    var proformaItemUrl = "/api/ProformaItem/";    
    var proformaUrl = "/api/Proforma/GetProforma/";    
    this.exchangeApi = "/api/exchange/";    
    this.id = this.route.snapshot.queryParamMap.get("id");    
    this.errorCustomer = false;    

    this.http.get<any>(customerUrl)
    .subscribe(p => {
      this.customers = p;
      this.customerFilteredOptions = this.CustomerControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._customerFilter(value))
      );

    });

    this.http.get<any>(proformaItemUrl)
    .subscribe(p => {
      this.ProformaItems = p.Items;      
      this.filteredProformas = p.Items;

      this.filteredOptions = this.PalletsControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });

    this.http.get<any>(this.exchangeApi)
    .subscribe(p => {
      this.ExchangeRate = p;
    });  

    var today = new Date();

    this.proforma.ProformaNumber =  Math.floor(1000 + Math.random() * 9000).toString();

    this.ProformaReportUrl = "/ProformaReport/print/?id=" + this.id;    

  }

  Add(newProformaId:number){
    var selectedProformaItem = this.ProformaItems.find( p=>p.ProformaItemId == newProformaId);
    var newProformaProformaItem = new ProformaProformaItem();
    newProformaProformaItem.ProformaItemId = selectedProformaItem.ProformaItemId;
    newProformaProformaItem.ProformaItem = selectedProformaItem;
    newProformaProformaItem.ProformaId = this.proforma.ProformaId;
    newProformaProformaItem.Proforma = this.proforma;    
    this.proformaProformaItems.push(newProformaProformaItem);
    this.autocomplete = "list-group collapse hide";
    this.searchText = "";
    this.Calculate();    
  }

  private _filter(value: string): ProformaItem[] {
    const filterValue = value.toString().toLowerCase();

    return this.ProformaItems.filter(
      option => option.ProformaItemId.toString().includes(filterValue)||
      option.Description.includes(filterValue));
  }
  
  private _customerFilter(value: string): Customer[] {
    const filterValue = value.toString().toLowerCase();
    return this.customers.filter(option => option.CustomerName.toLocaleLowerCase().includes(filterValue));
  }

  Delete(){        
    this.showSuccess = false;
    var invoiceUrl = "/api/Proforma/Delete/?proformaId=" + this.proforma.ProformaId;
    this.http
      .delete(invoiceUrl)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/home");
      });
  }

 
  RemoveItem(selectedProforma:ProformaProformaItem)
  {    
    const index: number = this.proformaProformaItems.indexOf(selectedProforma);
    if (index !== -1) {
        this.proformaProformaItems.splice(index, 1);
    }           
    this.Calculate();
  }


  Calculate(){
    this.TotalUsd = 0;
    
    for(var i=0;i<this.proformaProformaItems.length;i++){ 
      var weight = this.proformaProformaItems[i].Weight;   
      this.TotalUsd = weight * this.proformaProformaItems[i].Price + this.TotalUsd;
    }

  
    this.TotalUsd = this.TotalUsd - this.proforma.Discount;

    this.TotalUsd = Math.round(this.TotalUsd * 1000)/1000;
    this.Tax = this.TotalUsd * this.proforma.Kdv /100;
    this.Tax = Math.round(this.Tax * 1000)/1000;
    this.TotalUsd = this.TotalUsd + this.Tax;
    this.TotalLira = this.TotalUsd  * this.ExchangeRate;
    this.TotalLira = Math.round(this.TotalLira * 1000)/1000;    

  }

  Save(proforma: Proforma) {
    this.Calculate();
    this.showSuccess = false;
    this.saving = true;
    var proformaURL = "/api/Proforma/Insert";
    this.proforma.ProformaProformaItems = new Array<ProformaProformaItem>();

    if(!proforma.Customer || !proforma.Customer.CustomerName)
    {
      this.errorCustomer = true;
      return;

    }else{
      this.errorCustomer = false;
    }

    for(var i=0;i<this.proformaProformaItems.length;i++){
      var proformaProformaItem = new ProformaProformaItem();
      proformaProformaItem.ProformaId = this.proforma.ProformaId;
      proformaProformaItem.ProformaItemId = this.proformaProformaItems[i].ProformaItemId;
      proformaProformaItem.Weight = this.proformaProformaItems[i].Weight;
      proformaProformaItem.Price = this.proformaProformaItems[i].Price;
      proformaProformaItem.ProformaItem = this.proformaProformaItems[i].ProformaItem;
      proforma.ProformaProformaItems.push(proformaProformaItem);
    }

    this.proforma.Files = new Array<ProformaDocumentFile>();
    for(var i=0;i<this.files.length;i++){
      var file = new ProformaDocumentFile();
      file.ProformaId = this.proforma.ProformaId;
      file.DocumentFileId = this.files[i].DocumentFileId;
      file.File = new DocumentFile();      
      file.File.FileName = this.files[i].File.FileName;      
      this.proforma.Files.push(file);
    }        

    proforma.ExchangeRate = this.ExchangeRate;
    proforma.TotalUsd = this.TotalUsd;
    proforma.Tax = this.Tax;
    
    this.http
      .post<Proforma>(proformaURL, proforma)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  UpdateCustomer(option:Customer){
    this.proforma.Customer = option;
  }

  OnUploadFile()
  {
    this.form.value.fatura.filename =  "inv-"+this.id+"-" + this.form.value.fatura.filename 
    const formModel = this.form.value.fatura;
    this.uploading = true;    
    var invoiceUrl = '/api/AwsStorage/UploadFile/';    
    
    this.http
      .post(invoiceUrl,formModel)
      .toPromise()
      .then(()=>{
        var newProformaFile = new ProformaDocumentFile();
        newProformaFile.ProformaId = Number(this.id);
        var newFile = new DocumentFile();
        newFile.FileName = this.form.value.fatura.filename;        
        newProformaFile.File = newFile;
        this.files.push( newProformaFile);
        this.uploading = false;     
      });      
     
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
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


  RemoveFileItem(selectedFile:ProformaDocumentFile)
  {    
    const index: number = this.files.indexOf(selectedFile);
    if (index !== -1) {
        this.files.splice(index, 1);
    }               
  }

  Cancel() {
    this.router.navigateByUrl("/home");
  }


  searchChange() {
    if(this.searchText.length<1){
      this.autocomplete = "list-group collapse hide";
     }else{
      this.autocomplete = "list-group collapse show";
     }
  }

  AddNewItem(){
    var proformaProformaItem = new ProformaProformaItem();
    var proformaItem = new ProformaItem();
    proformaItem.Description = this.searchText;
    proformaItem.ProformaItemId = -1;
    proformaProformaItem.ProformaId = this.proforma.ProformaId;
    proformaProformaItem.ProformaItemId = -1;
    proformaProformaItem.ProformaItem = proformaItem;
    proformaProformaItem.Proforma  = this.proforma;
    this.proformaProformaItems.push(proformaProformaItem);
  }
  AddCustomer(newCustomerId:number){
    this.proforma.Customer = this.customers.find( p=>p.CustomerId == newCustomerId);
    this.customerAutocomplete = "list-group collapse hide";
    this.customerSearchText = this.proforma.Customer.CustomerName;
  }
  customerSearchChange() {
    this.customerAutocomplete = "list-group collapse show";      
}

}
