import { Component, OnInit } from "@angular/core";
import { Customer } from "../Customer";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-insert",
  templateUrl: "./insert.component.html",
  styleUrls: ["./insert.component.sass"]
})
export class InsertComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  showSuccess: boolean;
  customer: Customer;

  ngOnInit() {
    this.customer = new Customer();
  }

  Save(customer: Customer) {
    this.showSuccess = false;
    var palletsURL = "/api/Customer/Insert";
    this.http
      .post<Customer>(palletsURL, customer)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
      });
  }
  Cancel() {
    this.router.navigateByUrl("/index");
  }
}
