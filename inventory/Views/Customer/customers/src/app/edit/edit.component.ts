import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Customer } from "../Customer";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.sass"]
})
export class EditComponent implements OnInit {
  customer = new Customer();
  showSuccess = false;
  showError = false;
  deletemodal = false;
  id:string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get("id");
    var customerURL = "/api/Customer/GetCustomer/" + this.id;    
    this.http
      .get<Customer>(customerURL)
      .toPromise()
      .then(res => {
        this.customer = res;
      });
  }

  Save(customer: Customer) {
    this.showSuccess = false;
    var customerURL = "/api/Customer/Update";
    this.http
      .put<Customer>(customerURL, customer)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
      });
  }

  Delete() {
    this.showSuccess = false;
    var customerURL = "/api/Customer/Remove/" + this.id;
    this.http
      .delete<Customer>(customerURL)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/index");
      });
  }
  Cancel() {
    this.router.navigateByUrl("/index");
  }
  ConfirmDelete() {
    this.deletemodal = true;
  }
  CloseModal() {
    this.deletemodal = false;
  }

}
