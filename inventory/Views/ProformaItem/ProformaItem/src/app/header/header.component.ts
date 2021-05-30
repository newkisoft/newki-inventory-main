import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ShareService } from "../share.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  toggleButton= true;
  constructor(private shareService: ShareService,
    private http: HttpClient) { 
  }

  ngOnInit() {    
    this.shareService.changeMessage(this.toggleButton);    
  }

  toggle()
  {
    this.toggleButton = !this.toggleButton;
    this.shareService.changeMessage(this.toggleButton);    
  }
  
  signOut()
  {
    this.http      
    .post("/Account/Logout",null)
    .toPromise()
    .then(res=>{
      window.location.href = window.location.origin + "/Account/Login";
    }).catch(()=>{
      window.location.href = window.location.origin + "/Account/Login";
    });
    
  }

}
