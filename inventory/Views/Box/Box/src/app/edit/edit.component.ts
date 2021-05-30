import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Pallet } from '../../../../../Pallet/pallet/src/app/pallet';
import { Box } from "../Box";
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from "@angular/forms";


@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.sass"]
})
export class EditComponent implements OnInit {
  box = new Box();
  showSuccess = false;
  showError = false;
  pallets = new Array<Pallet>();
  PalletsControl = new FormControl();
  filteredOptions: Observable<Pallet[]>;
  deletemodal = false;
  showCamera: boolean;
  cannotDelete = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    var id = this.route.snapshot.queryParamMap.get("id");
    var boxsURL = "/api/box/Getbox/" + id;
    this.showCamera = true;
    this.http
      .get<Box>(boxsURL)
      .toPromise()
      .then(res => {
        this.box = res;
      });
    var palletUrl = "/api/Pallet/search/";
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
    var boxsURL = "/api/box/Update";
    this.http
      .put<Box>(boxsURL, box)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
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



  Delete() {
    this.showSuccess = false;
    var boxsURL = "/api/box/Remove/" + this.box.BoxId;
    var deleteGaurd = "/api/DeleteGaurd/CheckBox/" + this.box.BoxId;
    this.http
      .get<boolean>(deleteGaurd)
      .toPromise()
      .then(res => {
        this.cannotDelete = res;
        if (!res) {
          this.http
            .delete<Box>(boxsURL)
            .toPromise()
            .then(res => {
              this.showSuccess = true;
              this.router.navigateByUrl("/index");
            });
        }
      });
  }
  Cancel() {
    this.router.navigateByUrl("/index");
  }
  ConfirmDelete() {
    this.deletemodal = true;
  }
  CloseModal() {
    this.deletemodal = false;
  }

}
