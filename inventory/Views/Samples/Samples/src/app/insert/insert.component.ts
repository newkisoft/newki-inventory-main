import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "../Order";
import { FormControl } from "@angular/forms";
import { Customer } from "../../../../../Customer/customers/src/app/Customer";
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: "app-insert",
  templateUrl: "./insert.component.html",
  styleUrls: ["./insert.component.sass"]
})
export class InsertComponent implements OnInit {  
  showSuccess = false;
  showError = false;
  CustomerControl = new FormControl();
  Order = new Order();
  customers = new Array<Customer>();
  customerFilteredOptions: Observable<Customer[]>;
  saving:boolean;
  showCustomers:boolean;
  searchText:string;
  days:Array<number>;
  errorCustomer:boolean;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.Order.Customer = new Customer();
  }

  ngOnInit() {

    var customerUrl = "/api/Customer/";
    this.errorCustomer = false;
    

    this.http.get<any>(customerUrl)
    .subscribe(p => {
      this.customers = p;
      this.customerFilteredOptions = this.CustomerControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._customerFilter(value))
      );
    });
  }


  private _customerFilter(value: string): Customer[] {
    const filterValue = value.toString().toLowerCase();
    return this.customers.filter(option => option.CustomerName.toLocaleLowerCase().includes(filterValue));
  }

  Save(Order: Order) {
    this.saving = true;    
    this.showSuccess = false;
    var OrderURL = "/api/Order/Insert";    
    if(!Order.Customer || !Order.Customer.CustomerName)
    {
      this.errorCustomer = true;
      this.saving = false;
      return;
    }else{
      this.errorCustomer = false;
    }
    
    Order.OrderId = 0;
    
    this.http
      .post<Order>(OrderURL, Order)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  UpdateCustomer(option:Customer){
    this.Order.Customer = option;
  }

  SelectCustomer(option:Customer){
    this.Order.Customer = option;
  }

  SelectDate(option:string){    
    this.Order.OrderDate = option;
  }

  ToggleShowCustomers(){
    this.showCustomers = !this.showCustomers;
  }
  
  Cancel() {
    this.router.navigateByUrl("/home");
  }
}
