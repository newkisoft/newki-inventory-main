import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { GoodsContainer } from "../GoodsContainer";
import { FormControl } from "@angular/forms";
import { Customer } from "../../../../../Customer/customers/src/app/Customer";
import { Pallet } from "../../../../../Pallet/pallet/src/app/pallet";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GoodsContainerPallet } from '../GoodsContainerPallet';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DocumentFile } from '../DocumentFile';
import { GoodsContainerDocumentFile } from '../GoodsContainerDocumentFile';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  goodsContainer = new GoodsContainer();
  showSuccess = false;
  showError = false;
  CustomerControl = new FormControl();
  PalletsControl = new FormControl();
  pallets = new Array<Pallet>();
  newPallet = new Pallet();
  newPalletId: number;
  GoodsContainerReportUrl: string;
  ExitReportUrl: string;
  filteredOptions: Observable<Pallet[]>;
  customerFilteredOptions: Observable<Customer[]>;
  form: FormGroup;
  uploading: boolean;
  saving: boolean;
  files = new Array<GoodsContainerDocumentFile>();
  goodsContainerPallets = new Array<GoodsContainerPallet>();
  id: string;
  deletemodal = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      fatura: null
    });
  }

  ngOnInit() {
    var palletUrl = "/api/Pallet/";
    var GoodsContainerUrl = "/api/GoodsContainer/GetContainer/";
    this.id = this.route.snapshot.queryParamMap.get("id");

    this.http.get<any>(palletUrl)
      .subscribe(p => {
        this.pallets = p.Items;
        this.filteredOptions = this.PalletsControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      });

    this.http.get<any>(GoodsContainerUrl + this.id)
      .subscribe(p => {
        this.goodsContainer = p;
        for (var i = 0; i < p.GoodsContainerPallets.length; i++) {
          this.goodsContainerPallets.push(p.GoodsContainerPallets[i]);
        }
        for (var i = 0; i < p.Files.length; i++) {
          this.files.push(p.Files[i]);
        }
      });

  }

  Add(newPalletId: number) {
    var selectedPallet = this.pallets.find(p => p.PalletId == newPalletId);
    var newGoodsContainerPallet = new GoodsContainerPallet();
    newGoodsContainerPallet.PalletId = selectedPallet.PalletId;
    newGoodsContainerPallet.Pallet = selectedPallet;
    newGoodsContainerPallet.GoodsContainerId = this.goodsContainer.GoodsContainerId;
    newGoodsContainerPallet.GoodsContainer = this.goodsContainer;
    this.goodsContainerPallets.push(newGoodsContainerPallet);
    const index: number = this.pallets.indexOf(selectedPallet);
    if (index !== -1) {
      this.pallets.splice(index, 1);
    }
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

  Delete() {
    this.showSuccess = false;
    var GoodsContainerUrl = "/api/GoodsContainer/Delete/?GoodsContainerId=" + this.goodsContainer.GoodsContainerId;
    this.http
      .delete(GoodsContainerUrl)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/home");
      });
  }

  RemoveItem(selectedPallet: GoodsContainerPallet) {
    const index: number = this.goodsContainerPallets.indexOf(selectedPallet);
    if (index !== -1) {
      this.goodsContainerPallets.splice(index, 1);
    }
    this.pallets.push(selectedPallet.Pallet);
  }

  Save(goodsContainer: GoodsContainer) {
    this.showSuccess = false;
    this.saving = true;
    var GoodsContainerURL = "/api/GoodsContainer/Update";
    goodsContainer.GoodsContainerPallets = new Array<GoodsContainerPallet>();
    for (var i = 0; i < this.goodsContainerPallets.length; i++) {
      var goodsContainerPallet = new GoodsContainerPallet();
      goodsContainerPallet.GoodsContainerId = this.goodsContainer.GoodsContainerId;
      goodsContainerPallet.PalletId = this.goodsContainerPallets[i].PalletId;
      goodsContainerPallet.Pallet = this.goodsContainerPallets[i].Pallet;
      goodsContainer.GoodsContainerPallets.push(goodsContainerPallet);
    }

    goodsContainer.Files = new Array<GoodsContainerDocumentFile>();
    for (var i = 0; i < this.files.length; i++) {
      var file = new GoodsContainerDocumentFile();
      file.GoodsContainerId = goodsContainer.GoodsContainerId;
      file.DocumentFileId = this.files[i].DocumentFileId;
      file.File = new DocumentFile();
      file.File.FileName = this.files[i].File.FileName;
      goodsContainer.Files.push(file);
    }

    this.http
      .post<GoodsContainer>(GoodsContainerURL, goodsContainer)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  OnUploadFile() {
    this.form.value.fatura.filename = "import-" + this.id + "-" + this.form.value.fatura.filename
    const formModel = this.form.value.fatura;
    this.uploading = true;
    var awsUrl = '/api/AwsStorage/UploadFile/';
    var goodsContainerUrl = '/api/GoodsContainer/UploadFile/';

    this.http
      .post(awsUrl, formModel)
      .toPromise()
      .then(()=>{
          this.http
            .post(goodsContainerUrl, formModel)
            .subscribe(p=>{
              var newGoodsContainerFile = new GoodsContainerDocumentFile();
              newGoodsContainerFile.GoodsContainerId = Number(this.id);       
              var documentFile = new DocumentFile();
              documentFile.DocumentFileId = p["DocumentFileId"];
              documentFile.FileName = p["FileName"];
              newGoodsContainerFile.File = documentFile;
              newGoodsContainerFile.DocumentFileId = documentFile.DocumentFileId;
              this.files.push(newGoodsContainerFile);
              this.uploading = false;
            });
      });
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('fatura').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result
        })
      };
    }
  }

  RemoveFileItem(selectedFile: GoodsContainerDocumentFile) {
    const index: number = this.files.indexOf(selectedFile);
    if (index !== -1) {
      this.files.splice(index, 1);
    }
  }

  Cancel() {
    var state = this.location.getState() as any;
    if (state.navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/home");
    }

  }
  ConfirmDelete() {
    this.deletemodal = true;
  }
  CloseModal() {
    this.deletemodal = false;
  }
}
