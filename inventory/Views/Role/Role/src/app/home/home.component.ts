import { Component, OnInit } from "@angular/core";
import { UserProfile } from "../UserProfile";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {filteredLeaves} from "../filter.pipe";
import { IdentityRole } from '../IdentityRole';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  roles = new Array<IdentityRole>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  sortUp = new Array<boolean>();  
  totalPaid:number;
  totalDebt:number;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    var LeaveURL = "/api/role/";
    this.http
      .get<IdentityRole[]>(LeaveURL)
      .toPromise()
      .then(res => {
        this.roles = res["Items"];
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
  

  Sort(sortHeader:string){        
    
    }
}
