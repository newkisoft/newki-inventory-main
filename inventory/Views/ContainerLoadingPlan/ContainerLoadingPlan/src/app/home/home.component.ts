import { Component, OnInit } from "@angular/core";
import { ContainerPlan } from "../ContainerPlan";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { filteredplans } from "../filter.pipe";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  plans = new Array<ContainerPlan>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  sortUp = new Array<boolean>();
  totalPaid: number;
  totalDebt: number;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    var proformaURL = "/api/containerloadingplan/";
    this.http
      .get<ContainerPlan[]>(proformaURL)
      .toPromise()
      .then(res => {
        this.plans = res["Items"];
      });
  }

  doubleClick(event) {
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    //Navigate on double click
    this.router.navigate(["/edit/"], {
      queryParams: { id: event.currentTarget.children[0].innerText }
    });
  }

  Sort(sortHeader: string) {
    switch (sortHeader) {
      case 'ContainerPlanId':
        {
          this.sortUp[0] = !this.sortUp[0];
          if (this.sortUp[0]) {
            this.plans.sort((a, b) => a.ContainerPlanId - b.ContainerPlanId);
          } else {
            this.plans.sort((a, b) => b.ContainerPlanId - a.ContainerPlanId);
          }
          break;
        }
    }
  }
}
