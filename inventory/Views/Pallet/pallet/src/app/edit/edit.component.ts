import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Pallet } from "../pallet";
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators,FormControl } from "@angular/forms";
import { Setting } from "../Setting";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.sass"]
})
export class EditComponent implements OnInit {
  pallet = new Pallet();
  showSuccess = false;
  showError = false;
  saving: boolean = false;
  deletemodal = false;
  id: string;
  cannotDelete = false;
  form: FormGroup;
  uploading: boolean;
  showWareHouseOptions = false;
  settingsUrl = "/api/Settings/GetKey/";
  warehouses = new Array<string>();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private location: Location
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get("id");
    var palletsURL = "/api/Pallet/GetPallet/" + this.id;
    this.http
      .get<Pallet>(palletsURL)
      .toPromise()
      .then(res => {
        this.pallet = res;
      });
    this.http
      .get<Setting>(this.settingsUrl+"Warehouses")
      .toPromise()
      .then(res => {
        this.warehouses =  JSON.parse(res.Value);
      });
      this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      image: null
    });
  }

  Save(pallet: Pallet) {
    this.showSuccess = false;
    this.saving = true;
    var palletsURL = "/api/Pallet/Update";
    this.http
      .put<Pallet>(palletsURL, pallet)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  Delete() {
    this.showSuccess = false;
    var palletsURL = "/api/Pallet/Remove/" + this.id;
    var deleteGaurd = "/api/DeleteGaurd/CheckPallet/" + this.id;
    this.http
      .get<boolean>(deleteGaurd)
      .toPromise()
      .then(res => {        
        this.cannotDelete = res;
        if (!res) {          
          this.http
            .delete<Pallet>(palletsURL)
            .toPromise()
            .then(res => {
              this.showSuccess = true;
              this.router.navigateByUrl("/index");
            });
        }
      });


  }
  Cancel() {
    var state = this.location.getState() as any;
    if (state.navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/index");
    }

  }
  ConfirmDelete() {
    this.deletemodal = true;
  }
  CloseModal() {
    this.deletemodal = false;
  }
  Warehouse(location: string) {
    this.pallet.Warehouse = location;
    this.showWareHouseOptions = !this.showWareHouseOptions;
  }
    OnUploadFile(imageType:string) {    
    if(imageType == 'image'){
      this.form.value.image.filename = "pallet-image-" + this.id + "-" + this.form.value.image.filename;
    }else{
      this.form.value.image.filename = "pallet-thumbnail-image-" + this.id + "-" + this.form.value.image.filename;
    }
    const formModel = this.form.value.image;
    this.uploading = true;
    var invoiceUrl = '/api/AwsStorage/UploadFile/';

    this.http
      .post(invoiceUrl, formModel)
      .toPromise()
      .then(() => {
        if(imageType == 'image'){
          this.pallet.Image = this.form.value.image.filename;
        }else{          
          this.pallet.ThumbnailImage = this.form.value.image.filename;
        }
        this.uploading = false;
      });      
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('image').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result
        })
      };
    }
  }
}
