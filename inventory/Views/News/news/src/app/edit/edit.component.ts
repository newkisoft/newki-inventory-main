import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Pallet } from "../pallet";
import { Location } from '@angular/common';

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.sass"]
})
export class EditComponent implements OnInit {
  pallet = new Pallet();
  showSuccess = false;
  showError = false;
  saving:boolean = false;
  deletemodal = "modal hide";
  id:string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private location:Location
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get("id");
    var palletsURL = "/api/Pallet/GetPallet/" + this.id;
    this.http
      .get<Pallet>(palletsURL)
      .toPromise()
      .then(res => {
        this.pallet = res;
      });
  }

  Save(pallet: Pallet) {
    this.showSuccess = false;
    this.saving = true;
    var palletsURL = "/api/Pallet/Update";
    this.http
      .put<Pallet>(palletsURL, pallet)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  Delete() {
    this.showSuccess = false;
    var palletsURL = "/api/Pallet/Remove/" + this.id;
    this.http
      .delete<Pallet>(palletsURL)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/index");
      });
  }
  Cancel() {    
    var state = this.location.getState() as any;
    if(state.navigationId>1){
      this.location.back();
    }else{
      this.router.navigateByUrl("/index");
    }
    
  }
  ConfirmDelete() {
    this.deletemodal = "modal show";
  }
  CloseModal() {
    this.deletemodal = "modal hide";
  }
}
