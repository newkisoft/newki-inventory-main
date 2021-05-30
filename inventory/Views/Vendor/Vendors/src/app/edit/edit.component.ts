import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import {Vendor} from '../Vendor'


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  vendor = new Vendor();
  showSuccess = false;
  showError = false;
  deletemodal = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    var id = this.route.snapshot.queryParamMap.get("id");
    var vendorURL = "/api/Vendor/GetVendor/" + id;
    this.http
      .get<Vendor>(vendorURL)
      .toPromise()
      .then(res => {
        this.vendor = res;
      });
  }

  Save(vendor: Vendor) {
    this.showSuccess = false;
    var vendorURL = "/api/Vendor/Update";
    this.http
      .put<Vendor>(vendorURL, vendor)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
      });
  }

  Delete() {
    this.showSuccess = false;
    var vendorURL = "/api/Vendor/Remove/" + this.vendor.VendorId;
    this.http
      .delete<Vendor>(vendorURL)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/home");
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


