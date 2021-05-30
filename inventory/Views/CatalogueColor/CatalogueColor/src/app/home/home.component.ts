import { Component, OnInit } from "@angular/core";
import { CatalogueColor } from "../CatalogueColor";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  colors = new Array<CatalogueColor>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  totlWeight: number;
  sortUp = new Array<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    var catalogueURL = "/api/CatalogueColor/GetColors/";
    this.http
      .get<CatalogueColor[]>(catalogueURL)
      .subscribe(res => {
        this.colors = res;
        console.log(this.colors);
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
      case 'ColorCode':
        {
          this.sortUp[0] = !this.sortUp[0];
          if (this.sortUp[0]) {
            this.colors.sort((a, b) => a.ColorCode.toLocaleLowerCase().localeCompare(b.ColorCode.toLocaleLowerCase()));
          } else {
            this.colors.sort((a, b) => b.ColorCode.toLocaleLowerCase().localeCompare(a.ColorCode.toLocaleLowerCase()));
          }
          break;
        }
      case 'Color':
        {
          this.sortUp[1] = !this.sortUp[1];
          if (this.sortUp[1]) {
            this.colors.sort((a, b) => a.Color.toLocaleLowerCase().localeCompare(b.Color.toLocaleLowerCase()));
          } else {
            this.colors.sort((a, b) => b.Color.toLocaleLowerCase().localeCompare(a.Color.toLocaleLowerCase()));
          }
          break;
        }
      case 'Catalogue':
        {
          this.sortUp[2] = !this.sortUp[2];
          if (this.sortUp[2]) {
            this.colors.sort((a, b) => a.Catalogue.toLocaleLowerCase().localeCompare(b.Catalogue.toLocaleLowerCase()));
          } else {
            this.colors.sort((a, b) => b.Catalogue.toLocaleLowerCase().localeCompare(a.Catalogue.toLocaleLowerCase()));
          }
          break;
        }
    }
  }
}
