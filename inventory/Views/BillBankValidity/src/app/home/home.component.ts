import { Component, OnInit } from "@angular/core";
import { BillBank } from "../billbank";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { filteredBills } from "../filter.pipe";
import { FormBuilder,FormGroup, Validators } from "@angular/forms";
import { UploadFile } from '../UploadFile';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  bills = new Array<BillBank>();
  preventSingleClick = false;
  timer: any;
  delay: Number;
  sortUp = new Array<boolean>();
  searchText: string;
  filteredBills = new Array<BillBank>();
  totalRows = 0;
  max = 100;
  start = 51;
  showLoadMore = true;
  uploading = false;
  form: FormGroup;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      list: null
    });
   }

  ngOnInit() {
    var billBankURL = "/api/BillBankValidity/Get/";
    this.searchText = this.route.snapshot.queryParamMap.get("search");
    this.http
      .get<BillBank[]>(billBankURL)
      .toPromise()
      .then(res => {
        this.bills = res;
        this.filteredBills = this.bills;
        this.Count();
      });
  }

 
  Count() {
    var billURL = "/api/Bill/Count/";
    this.http
      .get<number>(billURL)
      .toPromise()
      .then(res => {
        this.totalRows = res;
      });
  }

  Sort(sortHeader: string) {
    switch (sortHeader) {
      case 'BillId':
        {
          this.sortUp[0] = !this.sortUp[0];
          if (this.sortUp[0]) {
            this.filteredBills.sort((a, b) => a.BillId - b.BillId);
          } else {
            this.filteredBills.sort((a, b) => b.BillId - a.BillId);
          }
          break;
        }
      case 'Description':
        {
          this.sortUp[1] = !this.sortUp[1];
          if (this.sortUp[1]) {
            this.filteredBills.sort((a, b) => a.Description.toLocaleLowerCase().localeCompare(b.Description.toLocaleLowerCase()));
          } else {
            this.filteredBills.sort((a, b) => b.Description.toLocaleLowerCase().localeCompare(a.Description.toLocaleLowerCase()));
          }
          break;
        }

      case 'BillDate':
        {
          this.sortUp[2] = !this.sortUp[2];
          if (this.sortUp[2]) {
            this.filteredBills.sort((a, b) => new Date(a.BillDate).getTime() - new Date(b.BillDate).getTime());
          } else {
            this.filteredBills.sort((a, b) => new Date(b.BillDate).getTime() - new Date(a.BillDate).getTime());
          }
          break;
        }
      case 'Amount':
        {
          this.sortUp[4] = !this.sortUp[4];
          if (this.sortUp[4]) {
            this.filteredBills.sort((a, b) => a.Amount - b.Amount);
          } else {
            this.filteredBills.sort((a, b) => b.Amount - a.Amount);
          }
          break;
        }
      }     
    }

  OnUploadFile() {    
    var uploadUrl = '/api/AwsStorage/UploadFile/';
    var updateUrl = '/api/BillBankValidity/Validate';
    this.uploading = true;
    this.uploadFile(this.form.value.list.filename, uploadUrl, updateUrl, this.form.value.list);
  }

  onBillFileChange(event) {
    this.fileChange(event, 'list',this.form);
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

  uploadFile(fileName: string, uploadUrl: string, updateUrl: string, formModel: any) {

    this.http
      .post(uploadUrl, formModel)
      .toPromise()
      .then(() => {                
        this.uploading = false;
        var uploadFile = new UploadFile();    
        uploadFile.filename = fileName;
        uploadFile.filetype = "CSV";
        this.http
        .post(updateUrl, uploadFile)
        .toPromise()
        .then(() => {
  
        });
      });  
  }
}
