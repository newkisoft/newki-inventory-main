import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ContainerPlan } from "../ContainerPlan";
import { FormControl } from "@angular/forms";
import { Customer } from "../../../../../Customer/customers/src/app/Customer";
import { Observable } from 'rxjs';
import { PalletPlan } from '../PalletPlan';
import { ContainerPlanPalletPlan } from '../ContainerPlanPalletPlan';
import { Location } from '@angular/common';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  CustomerControl = new FormControl();
  showSuccess = false;
  showError = false;
  customers = new Array<Customer>();
  customerFilteredOptions: Observable<Customer[]>;
  containerPlan = new ContainerPlan();
  newPallet = new ContainerPlanPalletPlan();
  saving = false;
  deletemodal = false;
  sideOne = new Array<ContainerPlanPalletPlan>();
  sideTwo = new Array<ContainerPlanPalletPlan>();
  id: string;
  

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.saving = false;
    this.newPallet.PalletPlan = new PalletPlan();
    this.containerPlan.EstimateArrivalDate = new Date();
    this.containerPlan.PalletPlans = new Array<ContainerPlanPalletPlan>();
    this.id = this.route.snapshot.queryParamMap.get("id");
    var planUrl = "/api/ContainerLoadingPlan/GetContainer/" + this.id;
    this.http.get<any>(planUrl)
      .subscribe(p => {
        this.containerPlan = p;
        this.DivideSides();
      });

  }
  public addPallet(newPallet: ContainerPlanPalletPlan) {
    this.newPallet.PalletPlan.PalletPlanId = 0;
    this.containerPlan.PalletPlans.push(this.newPallet);
    this.newPallet = new ContainerPlanPalletPlan();
    this.newPallet.PalletPlan = new PalletPlan();
    this.DivideSides();
  }
  public Save() {
    this.saving = true;
    this.showSuccess = false;
    var planUrl = "/api/ContainerLoadingPlan/Update/";
    this.http.post(planUrl, this.containerPlan)
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
    this.DivideSides();
  }
  ConfirmDelete() {
    this.deletemodal = true;
  }
  CloseModal() {
    this.deletemodal = false;
  }
  Delete() {
    this.showSuccess = false;
    var palletsURL = "/api/ContainerLoadingPlan/Delete/" + this.id;

    this.http
      .delete<ContainerPlan>(palletsURL)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/home");
      });
  }   

  DivideSides(){    
    this.sideOne = new Array<ContainerPlanPalletPlan>();
    this.sideTwo = new Array<ContainerPlanPalletPlan>();
    for(var cnt=0;cnt<this.containerPlan.PalletPlans.length;cnt++)
    {
       if(cnt < 13)
       {
         this.sideOne.push(this.containerPlan.PalletPlans[cnt]);
       }else{
        this.sideTwo.push(this.containerPlan.PalletPlans[cnt]);
       }
    }
  }

  GetHeightStyle(height)
  {
    if(height>800)
      height = 800;
    return height/4+"px";
  }

  GetTopStyle(height)
  {
    if(height>800)
      height = 800;
    return 190-height/4+"px";
  }

}
