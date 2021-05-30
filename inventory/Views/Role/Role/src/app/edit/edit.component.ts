import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { UserProfile } from "../UserProfile";
import { FormControl } from "@angular/forms";
import { Vendor } from "../../../../../Vendor/Vendors/src/app/Vendor";
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { UserRoleViewModel } from '../UserRolerViewModel';
import { IdentityRole } from '../IdentityRole';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  
  role = new IdentityRole();
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
  deletemodal = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {    
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
    
    var roleUrl = "/api/Role/GetRole/";    
    this.id = this.route.snapshot.queryParamMap.get("id");

    this.http.get<any>(roleUrl +  this.id)
    .subscribe(p => {
      this.role = p["Items"][0];
    });    
  }
  
  private _vendorFilter(value: string): Vendor[] {
    const filterValue = value.toString().toLowerCase();
    return this.vendors.filter(option => option.VendorName.toLocaleLowerCase().includes(filterValue));
  }

  Delete(){        
    this.showSuccess = false;
    var roleUrl = "/api/role/DeleteRole/?roleId=";    
    this.http.delete(roleUrl+this.id)
    .subscribe(p=>{
      this.router.navigateByUrl("/home");
    });
  }

  Save(role: IdentityRole) {    
    this.showSuccess = false;
    this.saving = true;
    var roleUrl = "/api/role/UpdateRole/";    
    this.http.put<any>(roleUrl,role)
    .subscribe(p => {
        this.saving = false;
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
