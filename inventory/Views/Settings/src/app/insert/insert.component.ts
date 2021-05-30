import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Setting } from "../Setting";

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.sass']
})
export class InsertComponent implements OnInit {
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
  timer: any;
  setting = new Setting();
  deletemodal = false;  
  preventSingleClick = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
  }


  ngOnInit() {

    
  }
  

  Delete(){        
  }

  Save() {   
    this.showSuccess = false;
    var url = "/api/Settings/Insert";
    
    this.http
      .post<Setting>(url, this.setting)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
      });
  }

  Cancel() {
    this.router.navigateByUrl("/home");
  }
  
}
