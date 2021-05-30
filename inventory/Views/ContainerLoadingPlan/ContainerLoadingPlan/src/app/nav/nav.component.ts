import { Component, OnInit } from '@angular/core';
import {Menu} from './Menu';
import { ShareService } from "../share.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  menus = Array<Menu>();

  toggleMenu = false;

  constructor(private shareService: ShareService,private http: HttpClient,) {
  }

  ngOnInit() {    

    this.http
    .get<string[]>("/api/nav/")
    .toPromise()
    .then(res => {
      for(var i=0;i<res.length;i++)
      {
        var menu = new Menu();
        menu.Text = res[i];
        menu.Url = "/"+res[i]+"/Index/index.html";        
        this.menus.push(menu);
      }
    })
    .catch( (error)=>{
      if(error.status == 200)
      {          
        window.location.href = window.location.origin+"/Account/login";
      }
    });

    this.shareService.currentMessage.subscribe(message=> this.toggleMenu = message);

  }

}
