import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ChangePasswordViewModel } from '../ChangePasswordViewModel';
import { IdentityError } from '../IdentityError';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"]
})
export class HomeComponent implements OnInit {
  changePasswordViewModel:ChangePasswordViewModel;
  errors = new Array<IdentityError>();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.changePasswordViewModel = new ChangePasswordViewModel();  
  }

  save()
  {
    var changePasswordUrl = "/api/ChangePassword/Update/";
    this.http
    .post<Array<IdentityError>>(changePasswordUrl, this.changePasswordViewModel)
    .toPromise()
    .then(res => {
          this.errors = res;
    });
  }  
}
