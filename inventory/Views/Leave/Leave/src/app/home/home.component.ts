import { Component, OnInit } from "@angular/core";
import { Leave } from "../Leave";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {filteredLeaves} from "../filter.pipe";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  Leaves = new Array<Leave>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  sortUp = new Array<boolean>();  
  totalPaid:number;
  totalDebt:number;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    var LeaveURL = "/api/Leave/";
    this.http
      .get<Leave[]>(LeaveURL)
      .toPromise()
      .then(res => {
        this.Leaves = res["Items"];
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
    switch(sortHeader){
      case 'LeaveId':
      {
        this.sortUp[0] = !this.sortUp[0];
        if(this.sortUp[0]){
          this.Leaves.sort((a,b) => a.LeaveId - b.LeaveId);
        }else{
          this.Leaves.sort((a,b) => b.LeaveId - a.LeaveId);
        }
        break;
      }
      case 'VendorName':
      {
          this.sortUp[1] = !this.sortUp[1];
          if(this.sortUp[1]){
            this.Leaves.sort((a,b) => a.Vendor.VendorName.toLocaleLowerCase().localeCompare(b.Vendor.VendorName.toLocaleLowerCase()));
          }else{
            this.Leaves.sort((a,b) => b.Vendor.VendorName.toLocaleLowerCase().localeCompare(a.Vendor.VendorName.toLocaleLowerCase()));
          }          
          break;
      }
      
      case 'LeaveStartDate':
      {
          this.sortUp[2] = !this.sortUp[2];
          if(this.sortUp[2]){
            this.Leaves.sort((a,b) => a.LeaveStartDate.localeCompare(b.LeaveStartDate));
          }else{
            this.Leaves.sort((a,b) => b.LeaveStartDate.localeCompare(a.LeaveStartDate));
          }
          break;
      }
      case 'LeaveEndDate':
        {
            this.sortUp[2] = !this.sortUp[2];
            if(this.sortUp[2]){
              this.Leaves.sort((a,b) => a.LeaveEndDate.localeCompare(b.LeaveEndDate));
            }else{
              this.Leaves.sort((a,b) => b.LeaveEndDate.localeCompare(a.LeaveEndDate));
            }
            break;
        }      
      }
    }
}
