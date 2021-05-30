import { Component, OnInit } from "@angular/core";
import { Pallet } from "../pallet";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { filteredPallets } from "../filter.pipe";
import { ColorSellingRatio } from "../ColorSellingRatio";

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
  exporting: boolean;
  palletsURL = "/api/Pallet/";
  showBulkUpdate = false;
  bulkWarehouse: string;
  bulkPrice: number;
  publishing = false;
  saving = false;
  inventoryLowAlertURL = "/api/Dashboard/InventoryLowAlert";
  filtersURL = "/api/filter/";
  alertsUrl = "/api/Alert/GetTekstilkent/";
  settingsUrl = "/api/Settings/GetKey/";
  showWareHouseOptions = false;
  bulkPallets = new Array<Pallet>();
  warehouses = new Array<string>();
  colorAlerts = new Array<ColorSellingRatio>();
  filterOptions = new Array<string>();
  tekstilkentAlerts = new Array<string>();
  filters = new Array<string>();
  isLoading = false;
  progress = "progress-bar progress-bar-striped progress-bar-animated w-0";
  progressPercent = 0;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.searchText = this.route.snapshot.queryParamMap.get("search");
    

    this.http
      .get<Array<ColorSellingRatio>>(this.inventoryLowAlertURL)
      .toPromise()
      .then(res => {
        this.colorAlerts = res;
      });

    this.http
      .get<Array<string>>(this.filtersURL)
      .toPromise()
      .then(res => {
        this.filterOptions = res;
        this.filterBy("\"Sold\":false");
      });

    this.http
      .get<Array<string>>(this.settingsUrl+"/Warehouses")
      .toPromise()
      .then(res => {
        this.warehouses = res;
      });

    this.http
      .get<Array<string>>(this.alertsUrl)
      .toPromise()
      .then(res => {
        this.tekstilkentAlerts = res;
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
      queryParams: { id: event.currentTarget.children[1].innerText }
    });
  }

  calculateTotalWeight() {
    this.totlWeight = 0;
    if (!filteredPallets) {
      for (var i = 0; i < this.filteredPallets.length; i++) {
        this.totlWeight += Number(this.filteredPallets[i].RemainWeight);
      }
      return;
    }

    for (var i = 0; i < filteredPallets.length; i++) {
      this.totlWeight += Number(filteredPallets[i].RemainWeight);
    }
  }

  Sort(sortHeader: string) {
    switch (sortHeader) {
      case 'PalletNumber':
        {
          this.sortUp[0] = !this.sortUp[0];
          if (this.sortUp[0]) {
            this.filteredPallets.sort((a, b) => a.PalletNumber - b.PalletNumber);
          } else {
            this.filteredPallets.sort((a, b) => b.PalletNumber - a.PalletNumber);
          }
          break;
        }
      case 'Barcode':
        {
          this.sortUp[1] = !this.sortUp[1];
          if (this.sortUp[1]) {
            this.filteredPallets.sort((a, b) => a.Barcode.localeCompare(b.Barcode));
          } else {
            this.filteredPallets.sort((a, b) => b.Barcode.localeCompare(a.Barcode));
          }
          break;
        }
      case 'YarnType':
        {
          this.sortUp[2] = !this.sortUp[2];
          if (this.sortUp[1]) {
            this.filteredPallets.sort((a, b) => a.YarnType.localeCompare(b.YarnType));
          } else {
            this.filteredPallets.sort((a, b) => b.YarnType.localeCompare(a.YarnType));
          }
          break;
        }
      case 'Denier':
        {
          this.sortUp[3] = !this.sortUp[3];
          if (this.sortUp[3]) {
            this.filteredPallets.sort((a, b) => a.Denier - b.Denier);
          } else {
            this.filteredPallets.sort((a, b) => b.Denier - a.Denier);
          }
          break;
        }
      case 'Filament':
        {
          this.sortUp[4] = !this.sortUp[4];
          if (this.sortUp[4]) {
            this.filteredPallets.sort((a, b) => a.Filament - b.Filament);
          } else {
            this.filteredPallets.sort((a, b) => b.Filament - a.Filament);
          }
          break;
        }
      case 'Lustre':
        {
          this.sortUp[5] = !this.sortUp[5];
          if (this.sortUp[5]) {
            this.filteredPallets.sort((a, b) => a.Lustre && b.Lustre && a.Lustre.localeCompare(b.Lustre));
          } else {
            this.filteredPallets.sort((a, b) => a.Lustre && b.Lustre && b.Lustre.localeCompare(a.Lustre));
          }
          break;
        }
      case 'Intermingle':
        {
          this.sortUp[6] = !this.sortUp[6];
          if (this.sortUp[6]) {
            this.filteredPallets.sort((a, b) => a.Intermingle && b.Intermingle && a.Intermingle.localeCompare(b.Intermingle));
          } else {
            this.filteredPallets.sort((a, b) => a.Intermingle && b.Intermingle && b.Intermingle.localeCompare(a.Intermingle));
          }
          break;
        }
      case 'Color':
        {
          this.sortUp[7] = !this.sortUp[7];
          if (this.sortUp[7]) {
            this.filteredPallets.sort((a, b) => a.Color && b.Color && a.Color.localeCompare(b.Color));
          } else {
            this.filteredPallets.sort((a, b) => a.Color && b.Color && b.Color.localeCompare(a.Color));
          }
          break;
        }
      case 'ColorCode':
        {
          this.sortUp[8] = !this.sortUp[8];
          if (this.sortUp[8]) {
            this.filteredPallets.sort((a, b) => a.ColorCode && b.ColorCode && a.ColorCode.localeCompare(b.ColorCode));
          } else {
            this.filteredPallets.sort((a, b) => a.ColorCode && b.ColorCode && b.ColorCode.localeCompare(a.ColorCode));
          }
          break;
        }
      case 'BobbinSize':
        {
          this.sortUp[9] = !this.sortUp[9];
          if (this.sortUp[9]) {
            this.filteredPallets.sort((a, b) => a.BobbinSize && b.BobbinSize && a.BobbinSize.localeCompare(b.BobbinSize));
          } else {
            this.filteredPallets.sort((a, b) => a.BobbinSize && b.BobbinSize && b.BobbinSize.localeCompare(a.BobbinSize));
          }
          break;
        }
      case 'Weight':
        {
          this.sortUp[10] = !this.sortUp[10];
          if (this.sortUp[10]) {
            this.filteredPallets.sort((a, b) => a.Weight - b.Weight);
          } else {
            this.filteredPallets.sort((a, b) => b.Weight - a.Weight);
          }
          break;
        }
      case 'RemainWeight':
        {
          this.sortUp[11] = !this.sortUp[11];
          if (this.sortUp[11]) {
            this.filteredPallets.sort((a, b) => a.RemainWeight - b.RemainWeight);
          } else {
            this.filteredPallets.sort((a, b) => b.RemainWeight - a.RemainWeight);
          }
          break;
        }
      case 'Sold':
        {
          this.sortUp[12] = !this.sortUp[12];
          if (this.sortUp[12]) {
            this.filteredPallets.sort((a, b) => a.Sold.toString().localeCompare(b.Sold.toString()));
          } else {
            this.filteredPallets.sort((a, b) => b.Sold.toString().localeCompare(a.Sold.toString()));
          }
          break;
        }
      case 'Lot':
        {
          this.sortUp[13] = !this.sortUp[13];
          if (this.sortUp[13]) {
            this.filteredPallets.sort((a, b) => a.Lot.localeCompare(b.Lot));
          } else {
            this.filteredPallets.sort((a, b) => b.Lot.localeCompare(a.Lot));
          }
          break;
        }

    }
  }
  filterBy(keyword: string) {
    this.progress = "progress-bar progress-bar-striped progress-bar-animated w-0";
    this.progressPercent = 0;
    this.filters.push(keyword);
    this.isLoading = true;
    this.progress = "progress-bar progress-bar-striped progress-bar-animated w-25";
    this.progressPercent = 25;
    this.http
      .post<Pallet[]>(this.palletsURL + "search/", this.filters)
      .toPromise()
      .then(res => {
        this.progress = "progress-bar progress-bar-striped progress-bar-animated w-85";
        this.progressPercent = 85;
        this.pallets = res;
        this.filteredPallets = this.pallets;
        this.calculateTotalWeight();
        this.isLoading = false;
        this.progress = "progress-bar progress-bar-striped progress-bar-animated w-100";
        this.progressPercent = 100;
      });
  }

  ChangeBulkUpdateDialogue() {
    this.showBulkUpdate = !this.showBulkUpdate;
    this.bulkPallets = new Array<Pallet>();
    for (var i = 0; i < this.pallets.length; i++) {
      if (this.pallets[i].Selected)
        this.bulkPallets.push(this.pallets[i]);
    }
  }
  ChangeWarehouse(warehosue: string) {
    this.bulkWarehouse = warehosue;
    this.showWareHouseOptions = !this.showWareHouseOptions;
  }


  Publish() {
    var palletsURL = "/api/ExportPallet/ExportForOnlineSale";
    this.publishing = true;
    this.http
      .get(palletsURL)
      .toPromise()
      .then(res => {
        this.publishing = false;

      });
  }
  BulkUpdate() {
    this.saving = true;
    var palletsURL = "/api/BulkPalletUpdate/Update";
    for (var i = 0; i < this.bulkPallets.length; i++) {
      if (this.bulkWarehouse && this.bulkWarehouse.length > 0)
        this.bulkPallets[i].Warehouse = this.bulkWarehouse;
      if (this.bulkPrice && this.bulkPrice != 0)
        this.bulkPallets[i].Price = this.bulkPrice;
    }
    this.http
      .put<Pallet>(palletsURL, this.bulkPallets)
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
        .post<Pallet[]>(this.palletsURL + "search/", this.filters)
        .toPromise()
        .then(res => {
          this.pallets = res;
          this.filteredPallets = this.pallets;
          this.calculateTotalWeight();
        });
  }

}
