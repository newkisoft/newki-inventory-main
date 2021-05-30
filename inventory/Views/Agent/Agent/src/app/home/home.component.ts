import { Component, OnInit } from "@angular/core";
import { Agent } from "../Agent";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  agents = new Array<Agent>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  totlWeight: number;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    var agentsURL = "/api/Agent/";
    this.http
      .get<Agent[]>(agentsURL)
      .toPromise()
      .then(res => {
        this.agents = res["Items"];
      });
  }
  singleClick(event) {
    this.preventSingleClick = false;
    const delay = 200;
    this.timer = setTimeout(() => {
      if (!this.preventSingleClick) {
        //Navigate on single click
        for (var i = 0; i < event.path[2].childElementCount; i++) {
          event.path[2].children[i].className = "";
        }
        event.path[1].className = "bg-warning";
      }
    }, delay);
    var filterPallets = this.agents.filter(p => {
      return p.Name.toLowerCase().includes(this.searchText);
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
}
