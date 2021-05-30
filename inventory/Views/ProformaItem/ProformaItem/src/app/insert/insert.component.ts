import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ProformaItem } from "../ProformaItem";

@Component({
  selector: "app-insert",
  templateUrl: "./insert.component.html",
  styleUrls: ["./insert.component.sass"]
})
export class InsertComponent implements OnInit {
  proformaItem = new ProformaItem();
  showSuccess = false;
  showError = false;
  saving:boolean = false;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {}

  Save(proformaItem: ProformaItem) {
    this.showSuccess = false;
    this.saving = true;
    var proformaItemURL = "/api/ProformaItem/Insert";
    this.http
      .post<ProformaItem>(proformaItemURL, this.proformaItem)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }
  Cancel() {
    this.router.navigateByUrl("/index");
  }
}
