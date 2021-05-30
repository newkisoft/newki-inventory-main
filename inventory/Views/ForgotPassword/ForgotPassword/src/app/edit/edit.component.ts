import { Component, AfterViewInit, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Invoice } from "../Invoice";
import { FormControl } from "@angular/forms";
import { Customer } from "../../../../../Customer/customers/src/app/Customer";
import { Pallet } from "../../../../../Pallet/pallet/src/app/pallet";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { InvoicePallet } from '../InvoicePallet';
import { Box } from '../../../../../Box/Box/src/app/Box';
import { InvoiceBox } from '../InvoiceBox';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DocumentFile } from '../DocumentFile';
import { InvoiceDocumentFile } from '../InvoiceDocumentFile';
import { Location } from '@angular/common';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  pallet = new Invoice();
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
  newPalletId: number;
  invoicePallets = new Array<InvoicePallet>();
  invoiceBoxes = new Array<InvoiceBox>();
  ExchangeRate: number;
  TotalUsd: number;
  TotalLira: number;
  Tax: number;
  TotalSoldWeight:number;
  InvoiceReportUrl: string;
  ExitReportUrl: string;
  filteredOptions: Observable<Pallet[]>;
  boxFilteredOptions: Observable<Box[]>;
  customerFilteredOptions: Observable<Customer[]>;
  form: FormGroup;
  uploading: boolean;
  exitReporting: boolean;
  generatingPdf: boolean;
  saving: boolean;
  files = new Array<InvoiceDocumentFile>();
  id: string;
  deletemodal= false;
  boxSearchText: string;
  boxSearchObserve = new Observable<string>();
  boxautocomplete = "list-group collapse hide";
  NumberOfBoxes=0;
  NumberOfPallets=0;
  showCamera = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.invoice.Customer = new Customer();
    this.invoice.Kdv = 8;
    this.TotalUsd = 0;
    this.TotalSoldWeight = 0;
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

    var customerUrl = "/api/Customer/";
    var palletUrl = "/api/Pallet/GetAvailablePallets";
    var boxUrl = "/api/Box/GetAvailableBoxes";
    var invoiceUrl = "/api/Invoice/GetInvoice/";
    this.id = this.route.snapshot.queryParamMap.get("id");

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

    this.http.get<any>(invoiceUrl + this.id)
      .subscribe(p => {
        this.invoice = p;
        for (var i = 0; i < p.InvoicePallets.length; i++) {
          this.invoicePallets.push(p.InvoicePallets[i]);
        }
        for (var i = 0; i < p.InvoiceBoxes.length; i++) {
          this.invoiceBoxes.push(p.InvoiceBoxes[i]);
        }
        for (var i = 0; i < p.Files.length; i++) {
          this.files.push(p.Files[i]);
        }
        this.ExchangeRate = this.invoice.ExchangeRate;
        this.TotalUsd = this.invoice.TotalUsd;
        this.Tax = this.invoice.Tax;
        this.Calculate();
      });

    this.InvoiceReportUrl = "/InvoiceReport/print/?id=" + this.id;
    this.ExitReportUrl = "/WarehouseTakeOutReport/print/?invoiceId=" + this.id;

  }

  Add(newPalletId: number) {
    var selectedPallet = this.pallets.find(p => p.PalletId == newPalletId);
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
    if (!value)
      filterValue = "";

    return this.boxes.filter(option => option.Barcode.toString().includes(filterValue) ||
      option.YarnType.includes(filterValue) ||
      option.Barcode.includes(filterValue) ||
      option.Weight.toString().includes(filterValue) ||
      option.Denier.toString().includes(filterValue) ||
      option.Filament.toString().includes(filterValue));
  }


  private _customerFilter(value: string): Customer[] {
    const filterValue = value.toString().toLowerCase();
    return this.customers.filter(option => option.CustomerName.toLocaleLowerCase().includes(filterValue));
  }

  Delete() {
    this.showSuccess = false;
    var invoiceUrl = "/api/Invoice/Delete/?invoiceId=" + this.invoice.InvoiceId;
    this.http
      .delete(invoiceUrl)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/home");
      });
  }

  SendEmail() {
    this.showSuccess = false;
    var invoiceUrl = "/api/email/?invoiceid=" + this.invoice.InvoiceId;
    this.http
      .get(invoiceUrl)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
      });
  }


  RemoveItem(selectedPallet: InvoicePallet) {
    const index: number = this.invoicePallets.indexOf(selectedPallet);
    if (index !== -1) {
      this.invoicePallets.splice(index, 1);
    }
    this.Calculate();
    this.pallets.push(selectedPallet.Pallet);
  }

  AddBox(newBoxId: number) {
    var selectedBox = this.boxes.find(p => p.BoxId == newBoxId);
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

  RemoveBoxItem(selectedBox: InvoiceBox) {
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

   Calculate() {
    this.TotalUsd = 0;
    this.TotalSoldWeight =0;
    this.NumberOfBoxes = 0;
    this.NumberOfPallets =0;

    for (var i = 0; i < this.invoicePallets.length; i++) {
      var weight = this.invoicePallets[i].Weight;
      this.TotalUsd = weight * this.invoicePallets[i].Pallet.Price + this.TotalUsd;
      this.TotalSoldWeight += weight;      
      this.NumberOfPallets++;      
    }

    for (var i = 0; i < this.invoiceBoxes.length; i++) {
      var weight = this.invoiceBoxes[i].Weight;
      this.TotalUsd = weight * this.invoiceBoxes[i].Box.Price + this.TotalUsd;
      this.TotalSoldWeight += weight;
      this.NumberOfBoxes++;
    }

    this.TotalUsd = this.TotalUsd - this.invoice.Discount;

    this.TotalUsd = Math.round(this.TotalUsd * 1000) / 1000;
    this.Tax = this.TotalUsd * this.invoice.Kdv / 100;
    this.Tax = Math.round(this.Tax * 1000) / 1000;
    this.TotalUsd = this.TotalUsd + this.Tax;
    this.TotalLira = this.TotalUsd * this.ExchangeRate;
    this.TotalLira = Math.round(this.TotalLira * 1000) / 1000;
    

  }

  Save(invoice: Invoice) {
    this.Calculate();
    this.showSuccess = false;
    this.saving = true;
    var invoiceURL = "/api/Invoice/Update";
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

    invoice.ExchangeRate = this.ExchangeRate;
    invoice.TotalUsd = this.TotalUsd;
    invoice.Tax = this.Tax;

    this.http
      .post<Invoice>(invoiceURL, invoice)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  UpdateCustomer(option: Customer) {
    this.invoice.Customer = option;
  }

  OnUploadFile() {
    this.form.value.fatura.filename = "inv-" + this.id + "-" + this.form.value.fatura.filename
    const formModel = this.form.value.fatura;
    this.uploading = true;
    var invoiceUrl = '/api/AwsStorage/UploadFile/';

    this.http
      .post(invoiceUrl, formModel)
      .toPromise()
      .then(() => {
        var newInvoiceFile = new InvoiceDocumentFile();
        newInvoiceFile.InvoiceId = Number(this.id);
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

  Cancel() {
    var state = this.location.getState() as any;
    if (state.navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/home");
    }

  }

  ConfirmDelete(){
    this.deletemodal = true;
  }
  CloseModal()
  {
    this.deletemodal = false;
  }
  searchChange() {
    if(this.boxSearchText.length<1){
      this.boxautocomplete = "list-group collapse hide";
     }else{
      this.boxautocomplete = "list-group collapse show";
      if(this.boxSearchText.length >= 26)
      {
        var cnt =0;
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
