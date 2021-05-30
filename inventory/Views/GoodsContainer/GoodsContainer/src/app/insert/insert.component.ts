import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { GoodsContainer } from "../GoodsContainer";
import { GoodsContainerPallet } from "../GoodsContainerPallet";
import { FormControl } from "@angular/forms";
import { Pallet } from "../../../../../Pallet/pallet/src/app/pallet";
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { GoodsContainerDocumentFile } from '../GoodsContainerDocumentFile';

@Component({
  selector: "app-insert",
  templateUrl: "./insert.component.html",
  styleUrls: ["./insert.component.sass"]
})
export class InsertComponent implements OnInit {  
  showSuccess = false;
  showError = false;
  CustomerControl = new FormControl();
  PalletsControl = new FormControl();
  goodsContainer = new GoodsContainer();
  pallets = new Array<Pallet>();
  newPallet = new Pallet();
  newPalletId:number;
  goodsContainerPallets = new Array<GoodsContainerPallet>();  
  filteredOptions: Observable<Pallet[]>;
  saving:boolean;
  searchText:string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.goodsContainer.GoodsContainerPallets = new Array<GoodsContainerPallet>();  
  }

  ngOnInit() {

    var palletUrl = "/api/Pallet/";
    this.http.get<any>(palletUrl)
    .subscribe(p => {
      this.pallets = p.Items;
      this.filteredOptions = this.PalletsControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      ); 
    });

    this.goodsContainer.ImportDate = new Date();
  }

  Add(newPalletId:number){
    var selectedPallet = this.pallets.find( p=>p.PalletId == newPalletId);
    var newGoodsContainerpallet = new GoodsContainerPallet();
    newGoodsContainerpallet.PalletId = selectedPallet.PalletId;
    newGoodsContainerpallet.Pallet = selectedPallet;
    newGoodsContainerpallet.GoodsContainerId = this.goodsContainer.GoodsContainerId;
    newGoodsContainerpallet.GoodsContainer = this.goodsContainer;
    this.goodsContainerPallets.push(newGoodsContainerpallet);
    const index: number = this.pallets.indexOf(selectedPallet);
    if (index !== -1) {
      this.pallets.splice(index, 1);
    }
  }

  RemoveItem(selectedPallet:GoodsContainerPallet)
  {    
    const index: number = this.goodsContainerPallets.indexOf(selectedPallet);
    if (index !== -1) {
        this.goodsContainerPallets.splice(index, 1);
    }           
    this.pallets.push(selectedPallet.Pallet);
  }

  private _filter(value: string): Pallet[] {
    const filterValue = value.toString().toLowerCase();

    
    return this.pallets.filter(
      option => option.PalletNumber.toString().includes(filterValue) ||
        option.YarnType.includes(filterValue) ||
        option.Barcode.includes(filterValue) ||
        option.Weight.toString().includes(filterValue) ||
        option.Denier.toString().includes(filterValue) ||
        option.Filament.toString().includes(filterValue));
  }

 
  Save(goodsContainer: GoodsContainer) {
    this.saving = true;
    this.showSuccess = false;
    var containerURL = "/api/GoodsContainer/Insert";    
    goodsContainer.GoodsContainerPallets = new Array<GoodsContainerPallet>();
    for(var i=0;i<this.goodsContainerPallets.length;i++){
      var goodsContainerPallet = new GoodsContainerPallet();      
      goodsContainerPallet.PalletId = this.goodsContainerPallets[i].PalletId;            
      goodsContainerPallet.GoodsContainerId = 0;            
      goodsContainer.GoodsContainerPallets.push(goodsContainerPallet);
    }    
    
    goodsContainer.Files = new Array<GoodsContainerDocumentFile>();

    this.http
      .post<GoodsContainer>(containerURL, goodsContainer)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  Cancel() {
    this.router.navigateByUrl("/home");
  }
}
