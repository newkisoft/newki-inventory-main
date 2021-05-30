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
  palletuploading: boolean;
  boxuploading: boolean;
  saving: boolean;
  id: string;
  form: FormGroup;
  palletform: FormGroup;
  boxform: FormGroup;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }
  createForm() {
    this.palletform = this.fb.group({
      name: ['', Validators.required],
      bulkpalletlist: null
    });
    this.boxform = this.fb.group({
      name: ['', Validators.required],
      bulkboxlist: null
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
  uploadFile(fileName: string, uploadUrl: string, updateUrl: string, formModel: any) {
    var uploadFiile = new UploadFile();    
    uploadFiile.filename = fileName;
    uploadFiile.filetype = "CSV";

    this.http
      .post(uploadUrl, formModel)
      .toPromise()
      .then(() => {                
        this.palletuploading = false;
        this.boxuploading = false;
        this.http
        .post(updateUrl, uploadFiile)
        .toPromise()
        .then(() => {
  
        });
      });

   
  }


  OnUploadPalletFile() {
    this.palletform.value.bulkpalletlist.filename = "bulk-pallet-upload-" + this.palletform.value.bulkpalletlist.filename;     
    var uploadUrl = '/api/AwsStorage/UploadFile/';
    var updateUrl = '/api/PalletBulkImport/UpdateAsync';
    this.palletuploading = true;
    this.uploadFile(this.palletform.value.bulkpalletlist.filename, uploadUrl, updateUrl, this.palletform.value.bulkpalletlist);
  }

  OnUploadBoxFile() {    
    this.boxform.value.bulkboxlist.filename =  "bulk-box-upload-" + this.boxform.value.bulkboxlist.filename;
    var uploadUrl = '/api/AwsStorage/UploadFile/';
    var updateUrl = '/api/BoxBulkImport/UpdateAsync';
    this.boxuploading = true;
    this.uploadFile(this.boxform.value.bulkboxlist.filename, uploadUrl, updateUrl, this.boxform.value.bulkboxlist);
  }
 


  onPalletFileChange(event) {
    this.fileChange(event, 'bulkpalletlist',this.palletform);
  }

  onBoxFileChange(event) {
    this.fileChange(event, 'bulkboxlist',this.boxform);
  }

}
