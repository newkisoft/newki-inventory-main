import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ContainerPlan } from "../ContainerPlan";
import { FormControl } from "@angular/forms";
import { Customer } from "../../../../../Customer/customers/src/app/Customer";
import { Observable, observable } from 'rxjs';
import { ContainerPlanPalletPlan } from '../ContainerPlanPalletPlan';
import { PalletPlan } from '../PalletPlan';
import { Location } from '@angular/common';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.sass']
})
export class InsertComponent implements OnInit {
  CustomerControl = new FormControl();
  showSuccess = false;
  showError = false;
  customers = new Array<Customer>();
  customerFilteredOptions: Observable<Customer[]>;
  containerPlan = new ContainerPlan();
  newPallet = new ContainerPlanPalletPlan();
  saving = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.newPallet.PalletPlan = new PalletPlan();
    this.containerPlan.EstimateArrivalDate = new Date();
    this.containerPlan.PalletPlans = new Array<ContainerPlanPalletPlan>();
  }

  public addPallet(newPallet: ContainerPlanPalletPlan) {
    this.newPallet.PalletPlan.PalletPlanId =0;
    this.containerPlan.PalletPlans.push(this.newPallet);
    this.newPallet = new ContainerPlanPalletPlan();    
    this.newPallet.PalletPlan = new PalletPlan();
  }
  public Save() {
    this.saving = true;
    this.showSuccess = false;
    var planUrl = "/api/ContainerLoadingPlan/Insert/";
    this.http.post(planUrl,this.containerPlan)
      .subscribe(p => {
        this.ngOnInit();
        this.showSuccess = true;
      });
  }
  Cancel() {
    var state = this.location.getState() as any;
    if (state.navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/home");
    }

  }

  RemoveItem(selectedBox: ContainerPlanPalletPlan) {
    const index: number = this.containerPlan.PalletPlans.indexOf(selectedBox);
    if (index !== -1) {
      this.containerPlan.PalletPlans.splice(index, 1);
    }    
  }

}
