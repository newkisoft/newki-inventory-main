import { Component, OnInit } from "@angular/core";
import { Order } from "../Order";
import { Router,ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {filteredOrders} from "../filter.pipe";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  Orders = new Array<Order>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  sortUp = new Array<boolean>();  
  totalPaid:number;
  totalDebt:number;
  syncing:boolean;

  constructor(private http: HttpClient, private router: Router,private route:ActivatedRoute) {}

  ngOnInit() {
    var OrderURL = "/api/Order/";
    this.searchText =this.route.snapshot.queryParamMap.get("search");
    this.http
      .get<Order[]>(OrderURL)
      .toPromise()
      .then(res => {
        this.Orders = res["Items"];
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
      case 'OrderId':
      {
        this.sortUp[0] = !this.sortUp[0];
        if(this.sortUp[0]){
          this.Orders.sort((a,b) => a.OrderId - b.OrderId);
        }else{
          this.Orders.sort((a,b) => b.OrderId - a.OrderId);
        }
        break;
      }
      case 'CustomerName':
      {
          this.sortUp[1] = !this.sortUp[1];
          if(this.sortUp[1]){
            this.Orders.sort((a,b) => a.Customer.CustomerName.toLocaleLowerCase().localeCompare(b.Customer.CustomerName.toLocaleLowerCase()));
          }else{
            this.Orders.sort((a,b) => b.Customer.CustomerName.toLocaleLowerCase().localeCompare(a.Customer.CustomerName.toLocaleLowerCase()));
          }          
          break;
      }
      
      case 'OrderDate':
      {
          this.sortUp[2] = !this.sortUp[2];
          if(this.sortUp[2]){
            this.Orders.sort((a,b) => a.OrderDate.localeCompare(b.OrderDate));
          }else{
            this.Orders.sort((a,b) => b.OrderDate.localeCompare(a.OrderDate));
          }
          break;
      }
      
    }
  }
}
