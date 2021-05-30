import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Pallet } from "../pallet";
import {Setting} from '../Setting';

@Component({
  selector: "app-insert",
  templateUrl: "./insert.component.html",
  styleUrls: ["./insert.component.sass"]
})
export class InsertComponent implements OnInit {
  pallet = new Pallet();
  showSuccess = false;
  showError = false;
  saving:boolean = false;
  settingsUrl = "/api/Settings/GetKey/";
  warehouses = new Array<string>();
  showWareHouseOptions= false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.http
    .get<Setting>(this.settingsUrl+"Warehouses")
    .toPromise()
    .then(res => {
      this.warehouses =  JSON.parse(res.Value);
    });
  }

  Save(pallet: Pallet) {
    this.showSuccess = false;
    this.saving = true;
    var palletsURL = "/api/Pallet/Insert";
    this.http
      .post<Pallet>(palletsURL, pallet)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }
  Cancel() {
    this.router.navigateByUrl("/index");
  }
  Warehouse(location:string){
    this.pallet.Warehouse = location;
    this.showWareHouseOptions = !this.showWareHouseOptions;
  }
}
