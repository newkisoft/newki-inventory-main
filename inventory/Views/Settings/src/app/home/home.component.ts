import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Setting } from "../Setting";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  sortUp = new Array<boolean>();  
  totalPaid:number;
  totalDebt:number;
  Settings= new Array<Setting>();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    var url = "/api/Settings/";
    this.http
      .get<Setting[]>(url)
      .toPromise()
      .then(res => {
        this.Settings = res;
      });
  }

  Sort(sortHeader:string){        
  }
  doubleClick(event) {
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    //Navigate on double click
    this.router.navigate(["/edit/"], {
      queryParams: { id: event.currentTarget.children[0].innerText }
    });
  }
}
