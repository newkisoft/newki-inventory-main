import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl } from "@angular/forms";

import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Setting } from "../Setting";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  showSuccess = false;
  showError = false;
  VendorControl = new FormControl();
  newProformaItemId:number;
  ExchangeRate:number;
  TotalUsd:number;
  TotalLira:number;
  Tax:number;
  ProformaReportUrl:string;
  ExitReportUrl:string;  
  form: FormGroup;
  uploading: boolean;
  exitReporting:boolean;
  generatingPdf:boolean;
  saving:boolean;  
  id:string;
  setting = new Setting();
  deletemodal = false;  


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      fatura: null
    });
  }

  ngOnInit() {

    var url = "/api/Settings/GetSetting/";    
    this.id = this.route.snapshot.queryParamMap.get("id");
    this.http.get<Setting>(url+this.id)
    .subscribe(p => {
      this.setting = p;
    });  
  }
  

  Delete(){        
  }

  Save() {    
    this.showSuccess = false;
    var url = "/api/Settings/UpdateAsync";
    
    this.http
      .put<Setting>(url, this.setting)
      .toPromise()
      .then(res => {        
        this.showSuccess = true;
      });
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
}
