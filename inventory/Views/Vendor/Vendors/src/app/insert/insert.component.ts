import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import {Vendor} from '../Vendor'



@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.sass']
})
export class InsertComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  showSuccess: boolean;
  vendor: Vendor;

  ngOnInit() {
    this.vendor = new Vendor();
  }

  Save(vendor: Vendor) {
    this.showSuccess = false;
    var palletsURL = "/api/Vendor/Insert";
    this.http
      .post<Vendor>(palletsURL, vendor)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
      });
  }
  Cancel() {
    this.router.navigateByUrl("/home");
  }
}
