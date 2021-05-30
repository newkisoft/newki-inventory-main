import { Component, OnInit } from "@angular/core";
import { Pallet } from "../pallet";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {filteredPallets} from "../filter.pipe";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.sass"]
})
export class IndexComponent implements OnInit {
  pallets = new Array<Pallet>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  totlWeight: number;
  sortUp = new Array<boolean>();  
  filteredPallets = new Array<Pallet>();
  exporting:boolean;
  

  constructor(private http: HttpClient, private router: Router,private route:ActivatedRoute) {}

  ngOnInit() {
    var palletsURL = "/api/Pallet/";
    this.searchText =this.route.snapshot.queryParamMap.get("search");
    this.http
      .get<Pallet[]>(palletsURL)
      .toPromise()
      .then(res => {
        this.pallets = res["Items"];
        this.filteredPallets = this.pallets;        
        this.calculateTotalWeight();
      });
  }
  Export() {
    var palletsURL = "/api/ExportPallet/";    
    this.exporting = true;
    this.http
      .get(palletsURL)
      .toPromise()
      .then(res => {        
        this.exporting = false;
        
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

  calculateTotalWeight(){        
    if(!filteredPallets)
      return;
    this.totlWeight = 0;
    for (var i = 0; i < filteredPallets.length; i++) {
      this.totlWeight += Number(filteredPallets[i].RemainWeight);
    }
  }

  Sort(sortHeader:string){        
    switch(sortHeader){
      case 'PalletNumber':
      {
        this.sortUp[0] = !this.sortUp[0];
        if(this.sortUp[0]){
          this.filteredPallets.sort((a,b) => a.PalletNumber - b.PalletNumber);
        }else{
          this.filteredPallets.sort((a,b) => b.PalletNumber - a.PalletNumber);
        }
        break;
      }
      case 'Barcode':
      {
          this.sortUp[1] = !this.sortUp[1];
          if(this.sortUp[1]){
            this.filteredPallets.sort((a,b) => a.Barcode.localeCompare(b.Barcode));
          }else{
            this.filteredPallets.sort((a,b) => b.Barcode.localeCompare(a.Barcode));
          }          
          break;
      }
      case 'YarnType':
      {
          this.sortUp[2] = !this.sortUp[2];
          if(this.sortUp[1]){
            this.filteredPallets.sort((a,b) => a.YarnType.localeCompare(b.YarnType));
          }else{
            this.filteredPallets.sort((a,b) => b.YarnType.localeCompare(a.YarnType));
          }          
          break;
      }
      case 'Denier':
      {
          this.sortUp[3] = !this.sortUp[3];
          if(this.sortUp[3]){
            this.filteredPallets.sort((a,b) => a.Denier - b.Denier);
          }else{
            this.filteredPallets.sort((a,b) => b.Denier - a.Denier);
          }          
          break;
      }
      case 'Filament':
      {
          this.sortUp[4] = !this.sortUp[4];
          if(this.sortUp[4]){
            this.filteredPallets.sort((a,b) => a.Filament - b.Filament);
          }else{
            this.filteredPallets.sort((a,b) => b.Filament - a.Filament);
          }          
          break;
      }
      case 'Intermingle':
      {          
          this.sortUp[5] = !this.sortUp[5];
          if(this.sortUp[5]){
            this.filteredPallets.sort((a,b) => a.Intermingle && b.Intermingle && a.Intermingle.localeCompare(b.Intermingle));
          }else{
            this.filteredPallets.sort((a,b) => a.Intermingle && b.Intermingle  && b.Intermingle.localeCompare(a.Intermingle));
          }          
          break;
      }
      case 'Color':
        {
            this.sortUp[6] = !this.sortUp[6];
            if(this.sortUp[6]){
              this.filteredPallets.sort((a,b) => a.Color && b.Color  &&  a.Color.localeCompare(b.Color));
            }else{
              this.filteredPallets.sort((a,b) => a.Color && b.Color  && b.Color.localeCompare(a.Color));
            }          
            break;
        }
        case 'ColorCode':
          {
              this.sortUp[7] = !this.sortUp[7];
              if(this.sortUp[7]){
                this.filteredPallets.sort((a,b) =>  a.ColorCode && b.ColorCode  &&   a.ColorCode.localeCompare(b.ColorCode));
              }else{
                this.filteredPallets.sort((a,b) =>  a.ColorCode && b.ColorCode  &&   b.ColorCode.localeCompare(a.ColorCode));
              }          
              break;
          }
          case 'BobbinSize':
            {
                this.sortUp[8] = !this.sortUp[8];
                if(this.sortUp[8]){
                  this.filteredPallets.sort((a,b) => a.BobbinSize && b.BobbinSize  && a.BobbinSize.localeCompare(b.BobbinSize));
                }else{
                  this.filteredPallets.sort((a,b) => a.BobbinSize && b.BobbinSize  && b.BobbinSize.localeCompare(a.BobbinSize));
                }          
                break;
            }
      case 'Weight':
      {
          this.sortUp[9] = !this.sortUp[9];
          if(this.sortUp[9]){
            this.filteredPallets.sort((a,b) => a.Weight - b.Weight);
          }else{
            this.filteredPallets.sort((a,b) => b.Weight - a.Weight);
          }
          break;
      }
      case 'RemainWeight':
      {
          this.sortUp[10] = !this.sortUp[10];
          if(this.sortUp[10]){
            this.filteredPallets.sort((a,b) =>a.RemainWeight - b.RemainWeight);
          }else{
             this.filteredPallets.sort((a,b) =>b.RemainWeight - a.RemainWeight);
          }
          break;
       }
      case 'Sold':
      {
              this.sortUp[11]=!this.sortUp[11];
              if(this.sortUp[11]){
                this.filteredPallets.sort((a,b) => a.Sold.toString().localeCompare(b.Sold.toString()));
              }else{
                this.filteredPallets.sort((a,b) => b.Sold.toString().localeCompare(a.Sold.toString()));
              }
              break;
        }     
    }
  }
}
