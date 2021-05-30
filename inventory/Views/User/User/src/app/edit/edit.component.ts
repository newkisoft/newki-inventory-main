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

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  userProfile = new UserProfile();
  userRoles = new Array<UserRoleViewModel>();
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

    var userUrl = "/api/User/GetByApplicationUserId/";    
    var roleUrl = "/api/Role/GetRoleByApplicationUserId/";    
    this.id = this.route.snapshot.queryParamMap.get("id");


    this.http.get<any>(userUrl +  this.id)
    .subscribe(p => {
      this.userProfile = p["Items"][0];
      this.http.get<any>(roleUrl +  this.id)
      .subscribe(p => {        
          this.userRoles = p["Items"];
      });   
    });    
  }
  
  private _vendorFilter(value: string): Vendor[] {
    const filterValue = value.toString().toLowerCase();
    return this.vendors.filter(option => option.VendorName.toLocaleLowerCase().includes(filterValue));
  }

  Delete(){        
    this.showSuccess = false;
   
  }

  Save(userProfile: UserProfile) {    
    this.showSuccess = false;
    this.saving = true;
    var profileSaved = false;
    var userUrl = "/api/User/Update/";    
    var userRolesUrl = "/api/Role/UpdateUserRole/";  

    this.http.post<any>(userUrl,userProfile)
    .subscribe(p => {
      profileSaved = true;
    });    

    this.http.post<any>(userRolesUrl,this.userRoles)
    .subscribe(p => {
      this.saving = false && profileSaved;
    });  
        
  }

  UpdateVendor(option:Vendor){
    
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
