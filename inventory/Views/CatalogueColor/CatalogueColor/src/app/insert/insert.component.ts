import { Component, OnInit } from "@angular/core";
import { CatalogueColor } from "../CatalogueColor";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-insert",
  templateUrl: "./insert.component.html",
  styleUrls: ["./insert.component.sass"]
})
export class InsertComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.colorform = this.fb.group({
      name: ['', Validators.required],
      colorlist: null
    });
  }
  showSuccess: boolean;
  catalogueColor: CatalogueColor;
  coloruploading:boolean;
  colorform:FormGroup;

  ngOnInit() {
    this.catalogueColor = new CatalogueColor();
  }

  fileChange(event, formInputName: string, formGroup:FormGroup) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        formGroup.get(formInputName).setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result
        })
      };
    }
  }
  uploadFile(uploadUrl: string, formModel: any) {

    this.http
      .post(uploadUrl, formModel)
      .toPromise()
      .then(() => {
        this.coloruploading = false;
      });
  }

  OnUploadColorFile() {
    var uploadUrl = '/api/CatalogueColor/InsertBulk';    
    this.colorform.value.colorlist.filename = "colors-" + this.colorform.value.colorlist.filename;    
    this.coloruploading = true;
    this.uploadFile( uploadUrl,this.colorform.value.colorlist);    
  }

  onColorFileChange(event) {
    this.fileChange(event, 'colorlist',this.colorform);
  }

  Save(catalogueColor: CatalogueColor) {
    this.showSuccess = false;
    var palletsURL = "/api/CatalogueColor/Insert";
    this.http
      .post<CatalogueColor>(palletsURL, catalogueColor)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
      });
  }
  Cancel() {
    this.router.navigateByUrl("/index");
  }
}
