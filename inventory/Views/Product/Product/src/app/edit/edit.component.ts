import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "../Product";
import { FormControl } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.sass"]
})
export class EditComponent implements OnInit {
  Product = new Product();
  showSuccess = false;
  showError = false;
  form: FormGroup;
  id:string;
  PalletsControl = new FormControl();
  deletemodal = false;
  uploading: boolean;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get("id");
    var ProductsURL = "/api/Product/GetProduct/" + this.id;
    this.http
      .get<Product>(ProductsURL)
      .toPromise()
      .then(res => {
        this.Product = res;
      });
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      image: null
    });
  }

  Save(Product: Product) {
    this.showSuccess = false;
    var ProductsURL = "/api/Product/Update";
    this.http
      .put<Product>(ProductsURL, Product)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
      });
  }

  Delete() {
    this.showSuccess = false;
    var ProductsURL = "/api/Product/Remove/" + this.Product.ProductId;
    this.http
      .delete<Product>(ProductsURL)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/index");
      });
  }

  OnUploadFile(imageType:string) {    
    this.form.value.image.filename = "product-image-" + this.id + "-" + this.form.value.image.filename
    const formModel = this.form.value.image;
    this.uploading = true;
    var invoiceUrl = '/api/AwsStorage/UploadFile/';

    this.http
      .post(invoiceUrl, formModel)
      .toPromise()
      .then(() => {
        if(imageType == 'image'){
          this.Product.Image = this.form.value.image.filename;
        }else{
          this.Product.ThumbnailImage = this.form.value.image.filename;
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

  Cancel() {
    this.router.navigateByUrl("/index");
  }
  ConfirmDelete(){
    this.deletemodal = true;
  }
  CloseModal()
  {
    this.deletemodal = false;
  }
}
