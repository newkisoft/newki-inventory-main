import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ProformaItem } from "../ProformaItem";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.sass"]
})
export class EditComponent implements OnInit {
  proformaItem = new ProformaItem();
  showSuccess = false;
  showError = false;
  saving:boolean = false;
  deletemodal = false;
  id:string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get("id");
    var ProformaItemsURL = "/api/ProformaItem/GetProformaItem/" + this.id;
    this.http
      .get<ProformaItem>(ProformaItemsURL)
      .toPromise()
      .then(res => {
        this.proformaItem = res;
      });
  }

  Save(proformaItem: ProformaItem) {
    this.showSuccess = false;
    this.saving = true;
    var ProformaItemsURL = "/api/ProformaItem/Update";
    this.http
      .put<ProformaItem>(ProformaItemsURL, proformaItem)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  Delete() {
    this.showSuccess = false;
    var ProformaItemsURL = "/api/ProformaItem/Remove/" + this.id;
    this.http
      .delete<ProformaItem>(ProformaItemsURL)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/index");
      });
  }
  Cancel() {
    this.router.navigateByUrl("/index");
  }
  ConfirmDelete() {
    this.deletemodal = true;
  }
  CloseModal() {
    this.deletemodal = false;
  }
}
