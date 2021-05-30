import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "../Order";
import { FormControl } from "@angular/forms";
import { Customer } from "../../../../../Customer/customers/src/app/Customer";
import { Pallet } from "../../../../../Pallet/pallet/src/app/pallet";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DocumentFile } from '../DocumentFile';
import { OrderDocumentFile } from '../OrderDocumentFile';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  showSuccess = false;
  showError = false;
  CustomerControl = new FormControl();
  Order = new Order();
  customers = new Array<Customer>();
  filteredOptions: Observable<Pallet[]>;
  customerFilteredOptions: Observable<Customer[]>;
  form: FormGroup;
  uploading: boolean;
  exitReporting: boolean;
  generatingPdf: boolean;
  saving: boolean;
  files = new Array<OrderDocumentFile>();
  id: string;
  deletemodal= false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.Order.Customer = new Customer();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      fatura: null
    });
  }

  ngOnInit() {

    var customerUrl = "/api/Customer/";
    var OrderUrl = "/api/Order/GetOrder/";
    this.id = this.route.snapshot.queryParamMap.get("id");

    this.http.get<any>(customerUrl)
      .subscribe(p => {
        this.customers = p;
        this.customerFilteredOptions = this.CustomerControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._customerFilter(value))
          );

      });

    this.http.get<any>(OrderUrl + this.id)
      .subscribe(p => {
        this.Order = p;
        for (var i = 0; i < p.Files.length; i++) {
          this.files.push(p.Files[i]);
        }
      });

  }

  private _customerFilter(value: string): Customer[] {
    const filterValue = value.toString().toLowerCase();
    return this.customers.filter(option => option.CustomerName.toLocaleLowerCase().includes(filterValue));
  }

  Delete() {
    this.showSuccess = false;
    var OrderUrl = "/api/Order/Delete/?OrderId=" + this.Order.OrderId;
    this.http
      .delete(OrderUrl)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.router.navigateByUrl("/home");
      });
  }

  Save(Order: Order) {
    this.showSuccess = false;
    this.saving = true;
    var OrderURL = "/api/Order/Update";
    
    this.Order.Files = new Array<OrderDocumentFile>();
    for (var i = 0; i < this.files.length; i++) {
      var file = new OrderDocumentFile();
      file.OrderId = this.Order.OrderId;
      file.DocumentFileId = this.files[i].DocumentFileId;
      file.File = new DocumentFile();
      file.File.FileName = this.files[i].File.FileName;
      this.Order.Files.push(file);
    }


    this.http
      .post<Order>(OrderURL, Order)
      .toPromise()
      .then(res => {
        this.showSuccess = true;
        this.saving = false;
      });
  }

  UpdateCustomer(option: Customer) {
    this.Order.Customer = option;
  }

  OnUploadFile() {
    this.form.value.fatura.filename = "inv-" + this.id + "-" + this.form.value.fatura.filename
    const formModel = this.form.value.fatura;
    this.uploading = true;
    var OrderUrl = '/api/AwsStorage/UploadFile/';

    this.http
      .post(OrderUrl, formModel)
      .toPromise()
      .then(() => {
        var newOrderFile = new OrderDocumentFile();
        newOrderFile.OrderId = Number(this.id);
        var newFile = new DocumentFile();
        newFile.FileName = this.form.value.fatura.filename;
        newOrderFile.File = newFile;
        this.files.push(newOrderFile);
        this.uploading = false;
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


  RemoveFileItem(selectedFile: OrderDocumentFile) {
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

  ConfirmDelete(){
    this.deletemodal = true;
  }
  CloseModal()
  {
    this.deletemodal = false;
  }
}
