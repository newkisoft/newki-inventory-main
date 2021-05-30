import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Leave } from "../Leave";
import { FormControl } from "@angular/forms";
import { Vendor } from "../../../../../Vendor/Vendors/src/app/Vendor";
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.sass']
})
export class InsertComponent implements OnInit {

  leave = new Leave();
  showSuccess = false;
  showError = false;
  VendorControl = new FormControl();
  vendors = new Array<Vendor>();
  newProformaItemId:number;
  ExchangeRate:number;
  TotalUsd:number;
  TotalLira:number;
  Tax:number;
  ProformaReportUrl:string;
  ExitReportUrl:string;  
  vendorFilteredOptions: Observable<Vendor[]>;
  form: FormGroup;
  uploading: boolean;
  exitReporting:boolean;
  generatingPdf:boolean;
  saving:boolean;  
  id:string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.leave.Vendor = new Vendor();        
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

    var vendorUrl = "/api/Vendor/";    
    var leaveUrl = "/api/Leave/GetLeave/";    
    this.id = this.route.snapshot.queryParamMap.get("id");

    this.http.get<any>(vendorUrl)
    .subscribe(p => {
      this.vendors = p;
      this.vendorFilteredOptions = this.VendorControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._vendorFilter(value))
      );

    });
    
  }
  
  private _vendorFilter(value: string): Vendor[] {
    const filterValue = value.toString().toLowerCase();
    return this.vendors.filter(option => option.VendorName.toLocaleLowerCase().includes(filterValue));
  }

  Delete(){        
    this.showSuccess = false;
    var leaveUrl = "/api/Leave/Delete/?leaveId=" + this.leave.LeaveId;
    this.http
      .delete(leaveUrl)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/home");
      });
  }

  Save(leave: Leave) {    
    this.showSuccess = false;
    this.saving = true;
    var leaveURL = "/api/Leave/Insert";
        
    this.http
      .post<Leave>(leaveURL, leave)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  UpdateVendor(option:Vendor){
    this.leave.Vendor = option;
  }

  Cancel() {
    this.router.navigateByUrl("/home");
  }
}
