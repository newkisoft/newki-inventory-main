import { Component, OnInit } from "@angular/core";
import { Product } from "../Product";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.sass"]
})
export class IndexComponent implements OnInit {
  products = new Array<Product>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  totlWeight: number;
  sortUp = new Array<boolean>();
  publishUrl = "/api/Product/publish/";
  uploading = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    var ProductesUrl = "/api/Product/";
    
    this.http
      .get<Product[]>(ProductesUrl)
      .toPromise()
      .then(res => {
        this.products = res["Items"];
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
    var filterProductes = this.products.filter(p => {
      return p.Description.toString().toLowerCase().includes(this.searchText) ||
        p.Name.toLowerCase().includes(this.searchText);
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
  publish(){
    this.uploading = true;
    this.http
    .get<string>(this.publishUrl)
    .toPromise()
    .then(res => {
      this.uploading = false;
    });
  }
  Sort(sortHeader: string) {
    switch (sortHeader) {
      case 'Name':
        {
          this.sortUp[1] = !this.sortUp[1];
          if (this.sortUp[1]) {
            this.products.sort((a, b) => a.Name.localeCompare(b.Name));
          } else {
            this.products.sort((a, b) => b.Name.localeCompare(a.Name));
          }
          break;
        }
      case 'Description':
        {
          this.sortUp[2] = !this.sortUp[2];
          if (this.sortUp[1]) {
            this.products.sort((a, b) => a.Description.localeCompare(b.Description));
          } else {
            this.products.sort((a, b) => b.Description.localeCompare(a.Description));
          }
          break;
        }
    }
  }
}
