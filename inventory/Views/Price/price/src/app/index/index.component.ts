import { Component, OnInit } from "@angular/core";
import { Price } from "../Price";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormControl } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UploadFile } from '../UploadFile'

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.sass"]
})
export class IndexComponent implements OnInit {
  prices = new Array<Price>();

  showSuccess = false;
  showError = false;
  CustomerControl = new FormControl();
  PalletsControl = new FormControl();
  BoxesControl = new FormControl();
  InvoiceReportUrl: string;
  ExitReportUrl: string;
  uploading: boolean;
  fdyuploading: boolean;
  lycrauploading: boolean;
  tfouploading: boolean;
  bcfuploading: boolean;
  shwuploading: boolean;
  exitReporting: boolean;
  generatingPdf: boolean;
  saving: boolean;
  id: string;
  form: FormGroup;
  fdyform: FormGroup;
  lycraform: FormGroup;
  bcfform: FormGroup;
  tfoform: FormGroup;
  shwform: FormGroup;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }
  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      pricelist: null
    });
    this.fdyform = this.fb.group({
      name: ['', Validators.required],
      fdypricelist: null
    });
    this.lycraform = this.fb.group({
      name: ['', Validators.required],
      lycrapricelist: null
    });
    this.tfoform = this.fb.group({
      name: ['', Validators.required],
      tfopricelist: null
    });
    this.bcfform = this.fb.group({
      name: ['', Validators.required],
      bcfpricelist: null
    });
    this.shwform = this.fb.group({
      name: ['', Validators.required],
      shwpricelist: null
    });
  }

  fileChange(event, formInputName: string, formGroup:FormGroup) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        formGroup.get(formInputName).setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result
        })
      };
    }
  }
  uploadFile(fileName: string, uploadUrl: string, updateUrl: string,palletPriceUpdateUrl:string, formModel: any) {
    var uploadFiile = new UploadFile();    
    uploadFiile.filename = fileName;
    uploadFiile.filetype = "CSV";

    this.http
      .post(uploadUrl, formModel)
      .toPromise()
      .then(() => {
        this.http
        .post(updateUrl, uploadFiile)
        .toPromise()
        .then(() => {
          
            this.uploading = false;
            this.fdyuploading = false;
            this.lycrauploading = false;
            this.bcfuploading = false;
            this.tfouploading = false;
            this.shwuploading = false;  
    
        });
      });

   

      
  }
  

  OnUploadFile() {
    var uploadUrl = '/api/AwsStorage/UploadFile/';
    var updateUrl = '/api/DtyPrice/Update';
    var palletPriceUpdateUrl = '/api/DtyPrice/UpdatePallets';
    this.uploading = true;
    this.uploadFile(this.form.value.pricelist.filename, uploadUrl,updateUrl, palletPriceUpdateUrl, this.form.value.pricelist);    
  }


  OnUploadFdyFile() {
    var uploadUrl = '/api/AwsStorage/UploadFile/';
    var updateUrl = '/api/FdyPrice/Update';
    var palletPriceUpdateUrl = '/api/FdyPrice/UpdatePallets';
    this.fdyuploading = true;
    this.uploadFile(this.fdyform.value.fdypricelist.filename, uploadUrl, updateUrl,palletPriceUpdateUrl, this.fdyform.value.fdypricelist);
  }

  OnUploadLycraFile() {    
    var uploadUrl = '/api/AwsStorage/UploadFile/';
    var updateUrl = '/api/LycraPrice/Update';
    var palletPriceUpdateUrl = '/api/LycraPrice/UpdatePallets';
    this.lycrauploading = true;
    this.uploadFile(this.lycraform.value.lycrapricelist.filename, uploadUrl, updateUrl,palletPriceUpdateUrl, this.lycraform.value.lycrapricelist);
  }

  OnUploadBcfFile() {    
    var uploadUrl = '/api/AwsStorage/UploadFile/';
    var updateUrl = '/api/BcfPrice/Update';
    var palletPriceUpdateUrl = '/api/BcfPrice/UpdatePallets';
    this.bcfuploading = true;
    this.uploadFile(this.bcfform.value.bcfpricelist.filename, uploadUrl, updateUrl,palletPriceUpdateUrl, this.bcfform.value.bcfpricelist);
  }

  OnUploadTfoFile() {    
    var uploadUrl = '/api/AwsStorage/UploadFile/';
    var updateUrl = '/api/TfoPrice/Update';
    var palletPriceUpdateUrl = '/api/TfoPrice/UpdatePallets';
    this.tfouploading = true;
    this.uploadFile(this.tfoform.value.tfopricelist.filename, uploadUrl, updateUrl,palletPriceUpdateUrl, this.tfoform.value.tfopricelist);
  }

  OnUploadShwFile() {    
    var uploadUrl = '/api/AwsStorage/UploadFile/';
    var updateUrl = '/api/ShwPrice/Update';
    var palletPriceUpdateUrl = '/api/ShwPrice/UpdatePallets';
    this.shwuploading = true;
    this.uploadFile(this.shwform.value.shwpricelist.filename, uploadUrl, updateUrl,palletPriceUpdateUrl, this.shwform.value.shwpricelist);
  }

  onFileChange(event) {
    this.fileChange(event, 'pricelist',this.form);
  }

  onFdyFileChange(event) {
    this.fileChange(event, 'fdypricelist',this.fdyform);
  }

  onLycraFileChange(event) {
    this.fileChange(event, 'lycrapricelist',this.lycraform);
  }

  onBcfFileChange(event) {
    this.fileChange(event, 'bcfpricelist',this.bcfform);
  }

  onTfoFileChange(event) {
    this.fileChange(event, 'tfopricelist',this.tfoform);
  }

  onShwFileChange(event) {
    this.fileChange(event, 'shwpricelist',this.shwform);
  }
}
