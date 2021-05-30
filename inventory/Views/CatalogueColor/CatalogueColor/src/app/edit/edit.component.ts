import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { CatalogueColor } from "../CatalogueColor";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.sass"]
})
export class EditComponent implements OnInit {
  catalogueColor = new CatalogueColor();
  showSuccess = false;
  showError = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    var id = this.route.snapshot.queryParamMap.get("id");
    var catalogueURL = "/api/CatalogueColor/GetColor/" + id;
    this.http
      .get<CatalogueColor>(catalogueURL)
      .toPromise()
      .then(res => {
        this.catalogueColor = res;
      });
  }

  Save(catalogueColor: CatalogueColor) {
    this.showSuccess = false;
    var catalogueURL = "/api/CatalogueColor/Update";
    this.http
      .put<CatalogueColor>(catalogueURL, catalogueColor)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
      });
  }

  Delete(catalogueColor: CatalogueColor) {
    this.showSuccess = false;
    var catalogueURL = "/api/CatalogueColor/Remove/" + catalogueColor.ColorCode;
    this.http
      .delete<CatalogueColor>(catalogueURL)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/index");
      });
  }
  Cancel() {
    this.router.navigateByUrl("/index");
  }
}
