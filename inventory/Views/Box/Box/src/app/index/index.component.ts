import { Component, OnInit } from "@angular/core";
import { Box } from "../Box";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.sass"]
})
export class IndexComponent implements OnInit {
  boxes = new Array<Box>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  searchText: string;
  totlWeight: number;
  sortUp = new Array<boolean>();  
  showBulkUpdate = false;
  bulkSold:string;
  bulkPrice:number;
  bulkBoxes = new Array<Box>();
  filteredBoxes = new Array<Box>();
  saving =false;
  enableStatus = false;
  enableStatusClass="btn btn-dark";
  disableStatusClass = "btn btn-outline-dark";
  filterOptions = new Array<string>();
  filters = new Array<string>();
  filtersURL = "/api/filter/box/";
  boxesURL = "/api/Box/";
  isLoading = false;
  progress = "progress-bar progress-bar-striped progress-bar-animated w-0";
  progressPercent = 0;


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    var boxesUrl = "/api/Box/";
     this.http
      .get<Array<string>>(this.filtersURL)
      .toPromise()
      .then(res => {
        this.filterOptions = res;
        this.filterBy("\"Sold\":false");
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
    var filterBoxes = this.boxes.filter(p => {
      return p.Denier.toString().toLowerCase().includes(this.searchText)||
             p.ColorCode.toLowerCase().includes(this.searchText)||
             p.Color.toLowerCase().includes(this.searchText)||
             p.Filament.toString().toLowerCase().includes(this.searchText);
    });
    this.totlWeight = 0;
    for (var i = 0; i < filterBoxes.length; i++) {
      this.totlWeight += Number(filterBoxes[i].RemainWeight);
    }
  }
  doubleClick(event) {
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    //Navigate on double click
    this.router.navigate(["/edit/"], {
      queryParams: { id: event.currentTarget.children[1].innerText }
    });
  }
  Sort(sortHeader:string){        
    switch(sortHeader){    
      case 'Barcode':
      {
          this.sortUp[1] = !this.sortUp[1];
          if(this.sortUp[1]){
            this.boxes.sort((a,b) => a.Barcode.localeCompare(b.Barcode));
          }else{
            this.boxes.sort((a,b) => b.Barcode.localeCompare(a.Barcode));
          }          
          break;
      }
      case 'YarnType':
      {
          this.sortUp[2] = !this.sortUp[2];
          if(this.sortUp[1]){
            this.boxes.sort((a,b) => a.YarnType.localeCompare(b.YarnType));
          }else{
            this.boxes.sort((a,b) => b.YarnType.localeCompare(a.YarnType));
          }          
          break;
      }
      case 'Denier':
      {
          this.sortUp[3] = !this.sortUp[3];
          if(this.sortUp[3]){
            this.boxes.sort((a,b) => a.Denier - b.Denier);
          }else{
            this.boxes.sort((a,b) => b.Denier - a.Denier);
          }          
          break;
      }
      case 'Filament':
      {
          this.sortUp[4] = !this.sortUp[4];
          if(this.sortUp[4]){
            this.boxes.sort((a,b) => a.Filament - b.Filament);
          }else{
            this.boxes.sort((a,b) => b.Filament - a.Filament);
          }          
          break;
      }
      case 'Intermingle':
      {          
          this.sortUp[5] = !this.sortUp[5];
          if(this.sortUp[5]){
            this.boxes.sort((a,b) => a.Intermingle && b.Intermingle && a.Intermingle.localeCompare(b.Intermingle));
          }else{
            this.boxes.sort((a,b) => a.Intermingle && b.Intermingle  && b.Intermingle.localeCompare(a.Intermingle));
          }          
          break;
      }
      case 'Color':
        {
            this.sortUp[6] = !this.sortUp[6];
            if(this.sortUp[6]){
              this.boxes.sort((a,b) => a.Color && b.Color  &&  a.Color.localeCompare(b.Color));
            }else{
              this.boxes.sort((a,b) => a.Color && b.Color  && b.Color.localeCompare(a.Color));
            }          
            break;
        }
        case 'ColorCode':
          {
              this.sortUp[7] = !this.sortUp[7];
              if(this.sortUp[7]){
                this.boxes.sort((a,b) =>  a.ColorCode && b.ColorCode  &&   a.ColorCode.localeCompare(b.ColorCode));
              }else{
                this.boxes.sort((a,b) =>  a.ColorCode && b.ColorCode  &&   b.ColorCode.localeCompare(a.ColorCode));
              }          
              break;
          }
          case 'BobbinSize':
            {
                this.sortUp[8] = !this.sortUp[8];
                if(this.sortUp[8]){
                  this.boxes.sort((a,b) => a.BobbinSize && b.BobbinSize  && a.BobbinSize.localeCompare(b.BobbinSize));
                }else{
                  this.boxes.sort((a,b) => a.BobbinSize && b.BobbinSize  && b.BobbinSize.localeCompare(a.BobbinSize));
                }          
                break;
            }
      case 'Weight':
      {
          this.sortUp[9] = !this.sortUp[9];
          if(this.sortUp[9]){
            this.boxes.sort((a,b) => a.Weight - b.Weight);
          }else{
            this.boxes.sort((a,b) => b.Weight - a.Weight);
          }
          break;
      }
      case 'RemainWeight':
      {
          this.sortUp[10] = !this.sortUp[10];
          if(this.sortUp[10]){
            this.boxes.sort((a,b) =>a.RemainWeight - b.RemainWeight);
          }else{
             this.boxes.sort((a,b) =>b.RemainWeight - a.RemainWeight);
          }
          break;
       }
      case 'Sold':
      {
              this.sortUp[11]=!this.sortUp[11];
              if(this.sortUp[11]){
                this.boxes.sort((a,b) => a.Sold.toString().localeCompare(b.Sold.toString()));
              }else{
                this.boxes.sort((a,b) => b.Sold.toString().localeCompare(a.Sold.toString()));
              }
              break;
        }     
    }
  }

  ChangeBulkUpdateDialogue(){
    this.showBulkUpdate = !this.showBulkUpdate;    
    this.bulkBoxes = new Array<Box>();
    for(var i=0;i<this.boxes.length;i++)
    {
      if(this.boxes[i].Selected)
        this.bulkBoxes.push(this.boxes[i]);
    }
  }
  ChangeSold(){    
      this.enableStatus = !this.enableStatus;
  }

  filterBy(keyword: string) {
    this.progress = "progress-bar progress-bar-striped progress-bar-animated w-0";    
    this.progressPercent = 0;
    this.filters.push(keyword);
    this.isLoading = true;
    this.progress = "progress-bar progress-bar-striped progress-bar-animated w-25";
    this.progressPercent = 25;
    
    this.http
      .post<Box[]>(this.boxesURL + "search/" , this.filters)
      .toPromise()
      .then(res => {
        this.progress = "progress-bar progress-bar-striped progress-bar-animated w-85";
        this.progressPercent = 85;

        this.boxes = res;
        this.filteredBoxes = this.boxes;
        this.isLoading = false;
        this.progress = "progress-bar progress-bar-striped progress-bar-animated w-100";
        this.progressPercent = 100;

      });
  }
  BulkUpdate()
  {    
    this.saving = true;
    var boxURL = "/api/BulkBoxUpdate/Update";
    for(var i=0;i<this.bulkBoxes.length;i++){
      if(this.enableStatus)
        this.bulkBoxes[i].Sold = this.bulkSold;
      if(this.bulkPrice && this.bulkPrice!=0)
        this.bulkBoxes[i].Price = this.bulkPrice;
    }
    this.http
      .put<Box>(boxURL, this.bulkBoxes)
      .toPromise()
      .then(res => {        
        this.saving = false;
      });
  }
  RemoveFilter(filter: string) {
    const index: number = this.filters.indexOf(filter);
    if (index !== -1) {
      this.filters.splice(index, 1);
    }
    this.http
      .post<Box[]>(this.boxesURL + "search/" , this.filters)
      .toPromise()
      .then(res => {
        this.boxes = res;
        this.filteredBoxes = this.boxes;
      });
  }
}
