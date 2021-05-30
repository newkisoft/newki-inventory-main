import { Component, OnInit } from '@angular/core';
import { Agent } from '../Agent';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Customer } from '../../../../../Customer/customers/src/app/Customer';
import {AgentCustomer} from '../AgentCustomer';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.sass']
})
export class InsertComponent implements OnInit {
  agent = new Agent();
  
  showSuccess = false;
  showError = false;
  myControl = new FormControl();
  CustomersControl = new FormControl();
  customers = new Array<Customer>();
  filteredOptions: Observable<Customer[]>;
  newAgentCustomer:number;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.agent.Customers = new Array<AgentCustomer>();
  }

  ngOnInit() {

    var customerUrl = "/api/Customer/";  
    
    this.http.get<any>(customerUrl)
    .subscribe(p => {
      this.customers = p;
      this.filteredOptions = this.CustomersControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });

   
  }

  Save(agent: Agent) {
    this.showSuccess = false;
    var agentUrl = "/api/Agent/Insert";
    
    this.http
      .post<Agent>(agentUrl, agent)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
      });
  }

  UpdateCustomer(option:AgentCustomer){
    this.agent.Customers.push(option);
  }
  
  Cancel() {
    this.router.navigateByUrl("/home");
  }

  RemoveItem(customer:AgentCustomer){
    const index: number = this.agent.Customers.indexOf(customer);
    if (index !== -1) {
        this.agent.Customers.splice(index, 1);
    }           
  }

  private _filter(value: string): Customer[] {
    const filterValue = value.toString().toLowerCase();

    return this.customers.filter(option => option.CustomerName.toLowerCase().includes(filterValue));
  }
}
