import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "../Product";
import { FormControl } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-insert",
  templateUrl: "./insert.component.html",
  styleUrls: ["./insert.component.sass"]
})
export class InsertComponent implements OnInit {
  Product = new Product();
  showSuccess = false;
  showError = false;
  form: FormGroup;
  id:string;
  PalletsControl = new FormControl();
  deletemodal:string;
  uploading: boolean;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.deletemodal = "modal hide";    
  }

  Save(Product: Product) {
    this.showSuccess = false;
    var ProductsURL = "/api/Product/Insert";
    this.http
      .post<Product>(ProductsURL, Product)
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

  OnUploadFile() {
    this.form.value.fatura.filename = "product-image-" + this.id + "-" + this.form.value.fatura.filename
    const formModel = this.form.value.fatura;
    this.uploading = true;
    var invoiceUrl = '/api/AwsStorage/UploadFile/';

    this.http
      .post(invoiceUrl, formModel)
      .toPromise()
      .then(() => {
        this.Product.Image = this.form.value.fatura.filename;
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
    this.deletemodal = "modal show";
  }
  CloseModal()
  {
    this.deletemodal = "modal hide";
  }
}
