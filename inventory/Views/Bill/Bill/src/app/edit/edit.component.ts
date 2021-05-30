import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Bill } from "../bill";
import { BillDocumentFile } from "../BillDocumentFile";
import { DocumentFile } from "../DocumentFile";
import { FormControl } from "@angular/forms";
import { Vendor } from "../../../../../Vendor/Vendors/src/app/Vendor";
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  bill = new Bill();
  showSuccess = false;
  showError = false;
  myControl = new FormControl();
  vendors = new Array<Vendor>();
  KDV: number;
  ExchangeRate: number;
  form: FormGroup;
  files = new Array<BillDocumentFile>();
  uploading: boolean;
  id: string;
  deletemodal = false;
  saving= false;
  errorVendor = false;
  vendorSearchText:string;
  vendorAutocomplete = "list-group collapse hide";
  externalExchangeApi: string;
  selectedCurrency="TRY";
  currencies=["TRY","USD","EUR"];
  exchangeApi ="";


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.bill.Vendor = new Vendor();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      fatura: null
    });
  }

  ngOnInit() {

    var vendorUrl = "/api/Vendor/";
    var billUrl = "/api/Bill/GetBill/";
    this.exchangeApi = "/api/exchange/Get/latest/";
    this.externalExchangeApi = "/api/exchange/Get/latest/";
    
    this.id = this.route.snapshot.queryParamMap.get("id");

    this.http.get<any>(vendorUrl)
      .subscribe(p => {
        this.vendors = p;
        this.http.get<any>(billUrl + this.id)
        .subscribe(p => {
          this.bill = p;
          for (var i = 0; i < p.Files.length; i++) {
            this.files.push(p.Files[i]);
          }
          this.AddVendor(this.bill.Vendor.VendorId);
        });
  
      });
  }

  Delete() {
    this.showSuccess = false;
    var billUrl = "/api/Bill/Delete/?billId=" + this.bill.BillId;
    this.http
      .delete(billUrl)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/home");
      });
  }

  Save(bill: Bill) {

    if(!bill.Vendor || !bill.Vendor.VendorName)
    {
      this.errorVendor = true;
      this.saving = false;
      return;
    }else{
      this.errorVendor = false;
    }
    
    this.showSuccess = false;
    this.saving = true;
    var billURL = "/api/Bill/Update";

    bill.Files = new Array<BillDocumentFile>();
    for (var i = 0; i < this.files.length; i++) {
      var file = new BillDocumentFile();
      file.BillId = bill.BillId;
      file.DocumentFileId = this.files[i].DocumentFileId;
      file.File = new DocumentFile();
      file.File.FileName = this.files[i].File.FileName;
      bill.Files.push(file);
    }

    this.http
      .post<Bill>(billURL, bill)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  UpdateVendor(option: Vendor) {
    this.bill.Vendor = option;
  }
  OnUploadFile() {
    this.form.value.fatura.filename = "bill-" + this.id + "-" + this.form.value.fatura.filename
    const formModel = this.form.value.fatura;
    this.uploading = true;
    var invoiceUrl = '/api/AwsStorage/UploadFile/';

    this.http
      .post(invoiceUrl, formModel)
      .toPromise()
      .then(() => {
        var newInvoiceFile = new BillDocumentFile();
        newInvoiceFile.BillId = Number(this.id);
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


  RemoveFileItem(selectedFile: BillDocumentFile) {
    const index: number = this.files.indexOf(selectedFile);
    if (index !== -1) {
      this.files.splice(index, 1);
    }
  }
  AddVendor(newVendorId:number){
    this.bill.Vendor = this.vendors.find( p=>p.VendorId == newVendorId);
    this.vendorAutocomplete = "list-group collapse hide";
    this.vendorSearchText = this.bill.Vendor.VendorName;
  }
  
  vendorSearchChange() {
    this.vendorAutocomplete = "list-group collapse show";      
  }

  Cancel() {
    var state = this.location.getState() as any;
    if (state.navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/index");
    }
  }
  ConfirmDelete() {
    this.deletemodal = true;
  }
  CloseModal() {
    this.deletemodal = false;
  }
  SelectCurrencty(currency:string)
  {
    this.selectedCurrency = currency;
    this.bill.Currency = currency;
    
    var url = currency == "TRY" ? this.exchangeApi :this.externalExchangeApi + currency+"/usd";

    this.http.get<any>(url)
    .subscribe(p => {
      this.bill.ExchangeRate = p;
    });
  }
}
