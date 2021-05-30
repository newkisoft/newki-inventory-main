import { Component, OnInit } from "@angular/core";
import { GoodsContainer } from "../GoodsContainer";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { filteredInvoices } from "../filter.pipe";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  containers = new Array<GoodsContainer>();
  timer: any;
  delay: Number;
  searchText: string;
  sortUp = new Array<boolean>();
  totalPaid: number;
  totalDebt: number;
  stock = new Map<number, number>();
  stockArray = new Array<number>();

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    var goodsContainerURL = "/api/GoodsContainer/";
    this.searchText = this.route.snapshot.queryParamMap.get("search");
    this.http
      .get<GoodsContainer[]>(goodsContainerURL)
      .toPromise()
      .then(res => {
        for (var container of res["Items"]) {
          var stockContainerURL = "/api/GoodsContainer/CountStock/" + container.GoodsContainerId;
          this.http
            .get<number>(stockContainerURL)            
            .subscribe(res => {              
              this.stock.set(res["id"], res["count"]);
            });
        }
        this.containers = res["Items"];
      });
  }

  doubleClick(event) {
    clearTimeout(this.timer);
    //Navigate on double click
    this.router.navigate(["/edit/"], {
      queryParams: { id: event.currentTarget.children[0].innerText }
    });
  }

  NumberOfStock(id: number) {
    return this.stock[id];
  }

  Sort(sortHeader: string) {

  }
}
