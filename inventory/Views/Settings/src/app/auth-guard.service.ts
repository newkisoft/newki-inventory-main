import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(protected router: Router, private http: HttpClient) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    this.http
      .get(window.location.origin+"/api/check/")
      .toPromise()
      .then()
      .catch((error) => {
        if (error.url.includes("Account/Login") ) {
          window.location.href = window.location.origin + "/Account/Login";
        }
      });

    return true;
  }
}
