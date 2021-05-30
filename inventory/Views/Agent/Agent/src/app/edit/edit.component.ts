import { Component, OnInit } from '@angular/core';
import { Agent } from '../Agent';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Customer } from '../../../../../Customer/customers/src/app/Customer';
import {AgentCustomer} from '../AgentCustomer';
import {AgentSalary} from '../AgentSalary';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {
  agent = new Agent();
  
  showSuccess = false;
  showError = false;
  myControl = new FormControl();
  CustomersControl = new FormControl();
  customers = new Array<Customer>();
  filteredOptions: Observable<Customer[]>;
  newAgentCustomer:number;
  agentSalaries= new Array<AgentSalary>();
  exchangeRate:string;  
  deletemodal = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.agent.Customers = new Array<AgentCustomer>();
  }

  ngOnInit() {

    var id = this.route.snapshot.queryParamMap.get("id");

    var customerUrl = "/api/Customer/";  
    var agentUrl = "/api/Agent/GetAgent/";
    var agentSalaryUrl = "/api/Agent/GetAgentsSalary/";
    var exchangeRateUrl = "/api/Exchange/";    
    
    this.http.get<any>(customerUrl)
    .subscribe(p => {
      this.customers = p;
      this.filteredOptions = this.CustomersControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });

    this.http.get<any>(agentUrl +  id)
    .subscribe(p => {
      this.agent = p;
    });


    this.http.get<any>(agentSalaryUrl +  id)
    .subscribe(p => {
       this.agentSalaries = p;
    });


    this.http.get<any>(exchangeRateUrl)
    .subscribe(p => {
      this.exchangeRate = p;
    });

   
  }

  Delete(){        
    this.showSuccess = false;
    var agentUrl = "/api/Agent/Remove/" + this.agent.AgentId;
    this.http
      .delete(agentUrl)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/home");
      });
  }

  Save(agent: Agent) {
  
    this.showSuccess = false;
    var billURL = "/api/Agent/Update";
   
    this.http
      .put<Agent>(billURL, agent)
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
  ConfirmDelete(){
    this.deletemodal = true;
  }
  CloseModal()
  {
    this.deletemodal = false;
  }
}
