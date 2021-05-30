import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Box } from "../Box";
import { Pallet } from '../../../../../Pallet/pallet/src/app/pallet';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-insert",
  templateUrl: "./insert.component.html",
  styleUrls: ["./insert.component.sass"]
})
export class InsertComponent implements OnInit {
  box = new Box();
  showSuccess = false;
  showError = false;
  pallets = new Array<Pallet>();
  PalletsControl = new FormControl();
  filteredOptions: Observable<Pallet[]>;
  showCamera: boolean;
  showDuplicateMessage = false;
  duplicate:Box;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    var palletUrl = "/api/Pallet/search/";
    this.showCamera = true;
    this.http.post<any>(palletUrl,["false"])
      .subscribe(p => {
        this.pallets = p;
        this.filteredOptions = this.PalletsControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      });

  }

  Save(box: Box) {
    this.showSuccess = false;
    var boxBarcodeURL = "/api/Box/GetBoxByBarcode/" + box.Barcode;
    this.http.get<Box>(boxBarcodeURL)
      .toPromise()
      .then(result => {
        this.showDuplicateMessage = false;
        if (!result) {
          var boxURL = "/api/Box/Insert";
          this.http
            .post<Box>(boxURL, box)
            .toPromise()
            .then(res => {
              this.showSuccess = true;
            });
        }else{
          this.showDuplicateMessage=true;
          this.duplicate = result;
        }
      });
  }

  private _filter(value: string): Pallet[] {
    const filterValue = value.toString().toLowerCase();

    return this.pallets.filter(option => option.PalletNumber.toString().includes(filterValue) ||
      option.YarnType.includes(filterValue) ||
      option.Denier.toString().includes(filterValue) ||
      option.Filament.toString().includes(filterValue));
  }

  Add(newPallet: Pallet) {
    this.box.PalletId = newPallet.PalletId;
    this.box.Denier = newPallet.Denier;
    this.box.Filament = newPallet.Filament;
    this.box.ColorCode = newPallet.ColorCode;
    this.box.Color = newPallet.Color;
    this.box.Price = newPallet.Price;
    this.box.BobbinSize = newPallet.BobbinSize;
    this.box.YarnType = newPallet.YarnType;
    this.box.Intermingle = newPallet.Intermingle;
  }

  Cancel() {
    this.router.navigateByUrl("/index");
  }

  
}
