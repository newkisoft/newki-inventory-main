import { Component, OnInit } from "@angular/core";
import { Bill } from "../bill";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { filteredBills } from "../filter.pipe";
import { Setting } from "../Setting";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  bills = new Array<Bill>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  sortUp = new Array<boolean>();
  searchText: string;
  filteredBills = new Array<Bill>();
  totalRows = 0;
  max = 100;
  start = 51;
  showLoadMore = true;
  settingsUrl = "/api/Settings/";
  safe = 0.0;
  setting = new Setting();
  savingSafe= false;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    var billURL = "/api/Bill/GetBill/0/" + this.max;
    this.searchText = this.route.snapshot.queryParamMap.get("search");
    this.http
      .get<Bill[]>(billURL)
      .toPromise()
      .then(res => {
        this.bills = res;
        this.filteredBills = this.bills;
        this.Count();
      });
      this.http
      .get<Setting>(this.settingsUrl+"GetKey/Safe")
      .toPromise()
      .then(res => {
        this.setting = res;
        this.safe =  Number.parseInt(res.Value);
      });
  }

  LoadAll() {    
      var billURL = "/api/Bill/GetBill/100/"+this.totalRows;
      this.http
        .get<Bill[]>(billURL)
        .toPromise()
        .then(res => {
          for (var cnt = 0; cnt < res.length; cnt++) {
            this.bills.push(res[cnt]);
            this.start++;
          }
            this.showLoadMore = false;
        });          }

  LoadMore() {
    if (this.start < this.totalRows ) {
      var billURL = "/api/Bill/GetBill/" + this.start + "/" + this.max;
      this.http
        .get<Bill[]>(billURL)
        .toPromise()
        .then(res => {
          for (var cnt = 0; cnt < res.length; cnt++) {
            this.bills.push(res[cnt]);
            this.start++;
          }
          if(this.start == this.totalRows)
          {
            this.showLoadMore = false;
          }
        });        
    }else{
      this.showLoadMore = false;
    }
  }

  Count() {
    var billURL = "/api/Bill/Count/";
    this.http
      .get<number>(billURL)
      .toPromise()
      .then(res => {
        this.totalRows = res;
      });
  }

  doubleClick(event) {
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    //Navigate on double click
    this.router.navigate(["/edit/"], {
      queryParams: { id: event.currentTarget.children[0].innerText }
    });
  }

  SaveSafe()
  {
    this.savingSafe = true;
    this.setting.Value = this.safe.toString();
    this.http
    .put<Setting>(this.settingsUrl+"UpdateAsync/",this.setting)
    .toPromise()
    .then(()=>{
      this.savingSafe = false;
    });
  }

  Sort(sortHeader: string) {
    switch (sortHeader) {
      case 'BillId':
        {
          this.sortUp[0] = !this.sortUp[0];
          if (this.sortUp[0]) {
            this.filteredBills.sort((a, b) => a.BillId - b.BillId);
          } else {
            this.filteredBills.sort((a, b) => b.BillId - a.BillId);
          }
          break;
        }
      case 'VendorName':
        {
          this.sortUp[1] = !this.sortUp[1];
          if (this.sortUp[1]) {
            this.filteredBills.sort((a, b) => a.Vendor.VendorName.toLocaleLowerCase().localeCompare(b.Vendor.VendorName.toLocaleLowerCase()));
          } else {
            this.filteredBills.sort((a, b) => b.Vendor.VendorName.toLocaleLowerCase().localeCompare(a.Vendor.VendorName.toLocaleLowerCase()));
          }
          break;
        }

      case 'BillDate':
        {
          this.sortUp[2] = !this.sortUp[2];
          if (this.sortUp[2]) {
            this.filteredBills.sort((a, b) => new Date(a.BillDate).getTime() - new Date(b.BillDate).getTime());
          } else {
            this.filteredBills.sort((a, b) => new Date(b.BillDate).getTime() - new Date(a.BillDate).getTime());
          }
          break;
        }
      case 'Amount':
        {
          this.sortUp[4] = !this.sortUp[4];
          if (this.sortUp[4]) {
            this.filteredBills.sort((a, b) => a.Amount - b.Amount);
          } else {
            this.filteredBills.sort((a, b) => b.Amount - a.Amount);
          }
          break;
        }
      case 'UsdAmount':
        {
          this.sortUp[4] = !this.sortUp[4];
          if (this.sortUp[4]) {
            this.filteredBills.sort((a, b) => a.UsdAmount - b.UsdAmount);
          } else {
            this.filteredBills.sort((a, b) => b.UsdAmount - a.UsdAmount);
          }
          break;
        }
      case 'Paid':
        {
          this.sortUp[5] = !this.sortUp[5];
          if (this.sortUp[5]) {
            this.filteredBills.sort((a, b) => a.Paid - b.Paid);
          } else {
            this.filteredBills.sort((a, b) => b.Paid - a.Paid);
          }
          break;
        }
    }
  }
}
