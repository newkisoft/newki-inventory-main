import { Component, OnInit } from "@angular/core";
import { ProformaItem } from "../ProformaItem";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {filteredProformaItems} from "../filter.pipe";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.sass"]
})
export class IndexComponent implements OnInit {
  proformaItems = new Array<ProformaItem>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  totlWeight: number;
  sortUp = new Array<boolean>();  
  filteredPforformaItems = new Array<ProformaItem>();
  

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    var proformaItemsURL = "/api/ProformaItem/";
    this.http
      .get<ProformaItem[]>(proformaItemsURL)
      .toPromise()
      .then(res => {
        this.proformaItems = res["Items"];
        this.filteredPforformaItems = this.proformaItems;                
      });
  }
  singleClick(event) {
    this.preventSingleClick = false;
    const delay = 200;
    this.timer = setTimeout(() => {
      if (!this.preventSingleClick) {
        //Navigate on single click
        for (var i = 0; i < event.path[2].childElementCount; i++) {
          event.path[2].children[i].className = "";
        }
        event.path[1].className = "bg-warning";
      }
    }, delay);
  }
  doubleClick(event) {
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    //Navigate on double click
    this.router.navigate(["/edit/"], {
      queryParams: { id: event.currentTarget.children[0].innerText }
    });
  }


  Sort(sortHeader:string){        
    switch(sortHeader){
      case 'ProformaItemId':
      {
        this.sortUp[0] = !this.sortUp[0];
        if(this.sortUp[0]){
          this.proformaItems.sort((a,b) => a.ProformaItemId - b.ProformaItemId);
        }else{
          this.proformaItems.sort((a,b) => b.ProformaItemId - a.ProformaItemId);
        }
        break;
      }
      case 'Description':
      {
          this.sortUp[1] = !this.sortUp[1];
          if(this.sortUp[1]){
            this.proformaItems.sort((a,b) => a.Description.localeCompare(b.Description));
          }else{
            this.proformaItems.sort((a,b) => b.Description.localeCompare(a.Description));
          }          
          break;
      }   
    }
  }
}
