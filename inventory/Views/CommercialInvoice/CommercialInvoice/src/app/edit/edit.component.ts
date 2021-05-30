import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { CommercialInvoice } from "../CommercialInvoice";
import { FormControl } from "@angular/forms";
import { Customer } from "../../../../../Customer/customers/src/app/Customer";
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { CommercialInvoiceCommercialInvoiceItem } from '../CommercialInvoiceCommercialInvoiceItem';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { DocumentFile } from '../DocumentFile';
import { CommercialInvoiceDocumentFile } from '../CommercialInvoiceDocumentFile';
import { CommercialInvoiceItem } from '../CommercialInvoiceItem';
import { filteredCommercialInvoices } from "../filter.pipe";
import { Invoice } from '../../../../../Invoice/Invoice/src/app/Invoice';
import { InvoicePallet } from '../../../../../Invoice/Invoice/src/app/InvoicePallet';
import { InvoiceBox } from '../../../../../Invoice/Invoice/src/app/InvoiceBox';
import {CommercialInvoiceExtra} from '../CommercialInvoiceExtra';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  CommercialInvoice = new CommercialInvoice();
  showSuccess = false;
  showError = false;
  PalletsControl = new FormControl();
  BoxesControl = new FormControl();
  CommercialInvoiceItems = new Array<CommercialInvoiceItem>();
  newCommercialInvoiceItem = new CommercialInvoiceItem();
  newCommercialInvoiceItemId:number;
  CommercialInvoiceCommercialInvoiceItems = new Array<CommercialInvoiceCommercialInvoiceItem>();    
  ExchangeRate:number;
  TotalUsd:number;
  TotalLira:number;
  Tax:number;
  CommercialInvoiceReportUrl:string;
  ExitReportUrl:string;
  filteredOptions: Observable<CommercialInvoiceItem[]>;  
  form: FormGroup;
  uploading: boolean;
  exitReporting:boolean;
  generatingPdf:boolean;
  saving:boolean;
  files = new Array<CommercialInvoiceDocumentFile>();  
  id:string;
  deletemodal = false;
  filteredCommercialInvoices = new Array<CommercialInvoiceItem>();
  searchText: string;
  searchObserve = new Observable<string>();
  autocomplete = "list-group collapse hide";
  errorCustomer:boolean;
  invoiceUrl = "/api/Invoice/GetInvoice/";
  invoicePallets = new Array<InvoicePallet>();
  invoiceBoxes = new Array<InvoiceBox>();
  invoice = new Invoice();
  invoiceId = 0;
  PackingListUrl = "";
  newExtra = new CommercialInvoiceExtra();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.CommercialInvoice.Kdv = 8;
    this.TotalUsd = 0;
    this.TotalLira = 0;
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

    var CommercialInvoiceItemUrl = "/api/CommercialInvoiceItem/";    
    var CommercialInvoiceUrl = "/api/CommercialInvoice/GetCommercialInvoice/";    
    this.id = this.route.snapshot.queryParamMap.get("id");
    this.errorCustomer = false;    

    this.http.get<any>(CommercialInvoiceItemUrl)
    .subscribe(p => {
      this.CommercialInvoiceItems = p.Items;
      this.filteredCommercialInvoices = p.Items;
      
    });

    this.http.get<any>(CommercialInvoiceUrl +  this.id)
    .subscribe(p => {
      this.CommercialInvoice = p;
   
      for(var i=0;i<p.Files.length;i++){
        this.files.push(p.Files[i]); 
      }
      this.ExchangeRate = this.CommercialInvoice.ExchangeRate;
      this.TotalUsd = this.CommercialInvoice.TotalUsd;
      this.Tax = this.CommercialInvoice.Tax;        
      this.Calculate();
      this.FindInvoice();
      this.PackingListUrl = "/PackingList/print/?id=" + this.id;
    });
    
    this.CommercialInvoiceReportUrl = "/CommercialInvoiceReport/print/?id=" + this.id;    

  }


 

  Delete(){        
    this.showSuccess = false;
    var invoiceUrl = "/api/CommercialInvoice/Delete/?CommercialInvoiceId=" + this.CommercialInvoice.CommercialInvoiceId;
    this.http
      .delete(invoiceUrl)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/home");
      });
  }

 
  RemoveItem(selectedCommercialInvoice:CommercialInvoiceCommercialInvoiceItem)
  {    
    const index: number = this.CommercialInvoiceCommercialInvoiceItems.indexOf(selectedCommercialInvoice);
    if (index !== -1) {
        this.CommercialInvoiceCommercialInvoiceItems.splice(index, 1);
    }           
    this.Calculate();
  }


  Calculate(){
    this.TotalUsd = 0;
    
    for(var i=0;i<this.CommercialInvoiceCommercialInvoiceItems.length;i++){ 
      var weight = this.CommercialInvoiceCommercialInvoiceItems[i].Weight;   
      this.TotalUsd = weight * this.CommercialInvoiceCommercialInvoiceItems[i].Price + this.TotalUsd;
    }

  
    this.TotalUsd = this.TotalUsd - this.CommercialInvoice.Discount;

    this.TotalUsd = Math.round(this.TotalUsd * 1000)/1000;
    this.Tax = this.TotalUsd * this.CommercialInvoice.Kdv /100;
    this.Tax = Math.round(this.Tax * 1000)/1000;
    this.TotalUsd = this.TotalUsd + this.Tax;
    this.TotalLira = this.TotalUsd  * this.ExchangeRate;
    this.TotalLira = Math.round(this.TotalLira * 1000)/1000;    

  }

  Save(CommercialInvoice: CommercialInvoice) {
    this.Calculate();
    this.showSuccess = false;
    this.saving = true;
    var CommercialInvoiceURL = "/api/CommercialInvoice/Update";

    if(!CommercialInvoice.InvoiceId )
    {
      this.errorCustomer = true;
      return;

    }else{
      this.errorCustomer = false;
    }


    this.CommercialInvoice.Files = new Array<CommercialInvoiceDocumentFile>();
    for(var i=0;i<this.files.length;i++){
      var file = new CommercialInvoiceDocumentFile();
      file.CommercialInvoiceId = this.CommercialInvoice.CommercialInvoiceId;
      file.DocumentFileId = this.files[i].DocumentFileId;
      file.File = new DocumentFile();      
      file.File.FileName = this.files[i].File.FileName;      
      this.CommercialInvoice.Files.push(file);
    }        

    CommercialInvoice.ExchangeRate = this.ExchangeRate;
    CommercialInvoice.TotalUsd = this.TotalUsd;
    CommercialInvoice.Tax = this.Tax;
    
    this.http
      .post<CommercialInvoice>(CommercialInvoiceURL, CommercialInvoice)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  UpdateCustomer(option:Customer){
    this.CommercialInvoice.Customer = option;
  }

  OnUploadFile()
  {
    this.form.value.fatura.filename =  "pro -"+this.id+"-" + this.form.value.fatura.filename 
    const formModel = this.form.value.fatura;
    this.uploading = true;    
    var invoiceUrl = '/api/AwsStorage/UploadFile/';    
    
    this.http
      .post(invoiceUrl,formModel)
      .toPromise()
      .then(()=>{
        var newCommercialInvoiceFile = new CommercialInvoiceDocumentFile();
        newCommercialInvoiceFile.CommercialInvoiceId = Number(this.id);
        var newFile = new DocumentFile();
        newFile.FileName = this.form.value.fatura.filename;        
        newCommercialInvoiceFile.File = newFile;
        this.files.push( newCommercialInvoiceFile);
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


  RemoveFileItem(selectedFile:CommercialInvoiceDocumentFile)
  {    
    const index: number = this.files.indexOf(selectedFile);
    if (index !== -1) {
        this.files.splice(index, 1);
    }               
  }

  Cancel() {
    this.router.navigateByUrl("/home");
  }
  ConfirmDelete() {
    this.deletemodal = true;
  }
  CloseModal() {
    this.deletemodal = false;
  }

  searchChange() {
    if(this.searchText.length<1){
      this.autocomplete = "list-group collapse hide";
     }else{
      this.autocomplete = "list-group collapse show";
     }
  }

  AddNewItem(){
    var CommercialInvoiceCommercialInvoiceItem = new CommercialInvoiceCommercialInvoiceItem();
    var CommercialInvoiceItem = new CommercialInvoiceItem();
    CommercialInvoiceItem.Description = this.searchText;
    CommercialInvoiceItem.CommercialInvoiceItemId = -1;
    CommercialInvoiceCommercialInvoiceItem.CommercialInvoiceId = this.CommercialInvoice.CommercialInvoiceId;
    CommercialInvoiceCommercialInvoiceItem.CommercialInvoiceItemId = -1;
    CommercialInvoiceCommercialInvoiceItem.CommercialInvoiceItem = CommercialInvoiceItem;
    CommercialInvoiceCommercialInvoiceItem.CommercialInvoice  = this.CommercialInvoice;
    this.CommercialInvoiceCommercialInvoiceItems.push(CommercialInvoiceCommercialInvoiceItem);
  }
  FindInvoice()
  {
    this.http.get<any>(this.invoiceUrl + this.CommercialInvoice.InvoiceId)
      .subscribe(p => {
        this.invoice = p;
        this.invoiceBoxes = new Array<InvoiceBox>();
        this.invoicePallets = new Array<InvoicePallet>();

        for (var i = 0; i < p.InvoicePallets.length; i++) {
          if (!p.InvoicePallets[i].Pallet.IsDelivered) {
            p.InvoicePallets[i].Pallet.DeliveryDate = new Date();
          }
          this.invoicePallets.push(p.InvoicePallets[i]);
        }
        for (var i = 0; i < p.InvoiceBoxes.length; i++) {
          if (!p.InvoiceBoxes[i].Box.IsDelivered) {
            p.InvoiceBoxes[i].Box.DeliveryDate = new Date();
          }
          this.invoiceBoxes.push(p.InvoiceBoxes[i]);
        }
 
        this.ExchangeRate = this.invoice.ExchangeRate;
        this.TotalUsd = this.invoice.TotalUsd;
        this.Tax = this.invoice.Tax;
        this.Calculate();
      });

  }

  AddExtra() {
    if (this.CommercialInvoice.Extras == null)
      this.CommercialInvoice.Extras = new Array<CommercialInvoiceExtra>();

    var newExtra = new CommercialInvoiceExtra();
    newExtra.Description = this.newExtra.Description;
    newExtra.Value = this.newExtra.Value;
    this.CommercialInvoice.Extras.push(newExtra);
    this.CommercialInvoice.Paid = this.CommercialInvoice.Paid + this.newExtra.Value;
    this.newExtra = new CommercialInvoiceExtra();   
  }

  RemoveExtra(selectedExtra: CommercialInvoiceExtra) {
    const index: number = this.CommercialInvoice.Extras.indexOf(selectedExtra);
    if (index !== -1) {
      this.CommercialInvoice.Extras.splice(index, 1);      
      this.CommercialInvoice.Paid = this.CommercialInvoice.Paid - selectedExtra.Value;
    }    
  }
 
}
