import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { UserProfile } from "../UserProfile";
import { FormControl } from "@angular/forms";
import { Vendor } from "../../../../../Vendor/Vendors/src/app/Vendor";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserRoleViewModel } from '../UserRolerViewModel';
import { IdentityRole } from '../IdentityRole';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.sass']
})
export class InsertComponent implements OnInit {
  role = new IdentityRole();
  userProfile = new UserProfile();
  userRoles = new Array<IdentityRole>();
  showSuccess = false;
  showError = false;
  VendorControl = new FormControl();
  vendors = new Array<Vendor>();
  newProformaItemId: number;
  ExchangeRate: number;
  TotalUsd: number;
  TotalLira: number;
  Tax: number;
  ProformaReportUrl: string;
  ExitReportUrl: string;
  vendorFilteredOptions: Observable<Vendor[]>;
  form: FormGroup;
  uploading: boolean;
  exitReporting: boolean;
  generatingPdf: boolean;
  saving: boolean;
  id: string;
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

   
    this.userProfile = new UserProfile();   
  }

  private _vendorFilter(value: string): Vendor[] {
    const filterValue = value.toString().toLowerCase();
    return this.vendors.filter(option => option.VendorName.toLocaleLowerCase().includes(filterValue));
  }

  Delete() {
    this.showSuccess = false;

  }

  Save(role: IdentityRole) {    
    this.showSuccess = false;
    this.saving = true;
    var roleUrl = "/api/role/InsertRole/";    
    this.http.post<any>(roleUrl,role)
    .subscribe(p => {
        this.saving = false;
        this.showSuccess = true;
    });    
  }
  UpdateVendor(option: Vendor) {

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
