import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { Invoice } from "../Invoice";
import { GroupReport } from "../GroupReport";
import { Bill } from "../bill";
import { ColorSellingRatio } from "../ColorSellingRatio";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Point } from "../point"
import { Pallet } from '../../../../../Pallet/pallet/src/app/pallet';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  invoices = new Array<GroupReport>();
  bills = new Array<GroupReport>();
  dtyPallets = new Array<GroupReport>();
  fdyPallets =  new Array<GroupReport>();
  colorSellingRatios = new Array<ColorSellingRatio>();
  colorAlerts = new Array<ColorSellingRatio>();
  dtyPalletPoints = new Array<Point>();
  fdyPalletPoints = new Array<Point>();
  points = new Array<Point>();
  billPoints = new Array<Point>();
  isDraging=false;
  isMouseDown = false;
  index=0;
  salesZoom =1200;
  zoomBox = "0 0 1200 300";

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,private element:ElementRef) { }

  ngOnInit() {
    var invoiceURL = "/api/Dashboard/GetInvoices";
    var expenseURL = "/api/Dashboard/GetExpenses";
    var dtyPalletURL = "/api/Dashboard/GetInventoryDTY";
    var fdyPalletURL = "/api/Dashboard/GetInventoryFDY";
    var sellRatioURL = "/api/Dashboard/SellRatio";
    var inventoryLowAlertURL = "/api/Dashboard/InventoryLowAlert";
    this.http
      .get<Array<GroupReport>>(invoiceURL)
      .toPromise()
      .then(res => {
        this.invoices = res;
        var x = 0;
        for(let invoiceGroup of this.invoices)
        {
            var y = 0;
            for(let invoice of invoiceGroup.Elements)
            {              
              var inv = invoice as Invoice;
              y = y + inv.TotalUsd;
            }            
            var point = new Point();
            point.y = y / 1000;
            point.x = x;            
            point.month = invoiceGroup.Key;
            this.points.push(point);
            x += 50;    

        }
      });
    this.http
      .get<Array<GroupReport>>(expenseURL)
      .toPromise()
      .then(res => {
        this.bills = res;
        var x = 0;
        for(let billGroup of this.bills)
        {
            var y = 0;
            for(let bill of billGroup.Elements)
            {              
              var bil = bill as Bill;              
              y = y + bil.UsdAmount + bil.Amount/bil.ExchangeRate;
            }            
            var point = new Point();
            point.y = y / 1000;
            point.x = x;            
            point.month = billGroup.Key;
            this.billPoints.push(point);
            x += 50;    

        }
      });
    this.http
      .get<Array<GroupReport>>(dtyPalletURL)
      .toPromise()
      .then(res => {
        this.dtyPallets = res;
        var x = 0;
        for(let dtyGroup of this.dtyPallets)
        {
            var y = 0;
            for(let pallet of dtyGroup.Elements)
            {              
              var pal = pallet as Pallet;
              y = y + pal.RemainWeight;
            }            
            var point = new Point();
            point.y = y / 1000;
            point.x = x;            
            point.month = dtyGroup.Key;
            this.dtyPalletPoints.push(point);
            x += 50;    

        }
      });

      this.http
      .get<Array<GroupReport>>(fdyPalletURL)
      .toPromise()
      .then(res => {
        this.fdyPallets = res;
        var x = 0;
        for(let fdyGroup of this.fdyPallets)
        {
            var y = 0;
            for(let pallet of fdyGroup.Elements)
            {              
              var pal = pallet as Pallet;
              y = y + pal.RemainWeight;
            }            
            var point = new Point();
            point.y = y / 1000;
            point.x = x;            
            point.month = fdyGroup.Key;
            this.fdyPalletPoints.push(point);
            x += 50;    

        }
      });


      this.http
      .get<Array<ColorSellingRatio>>(sellRatioURL)
      .toPromise()
      .then(res => {
        this.colorSellingRatios = res;       
      });

      this.http
      .get<Array<ColorSellingRatio>>(inventoryLowAlertURL)
      .toPromise()
      .then(res => {
        this.colorAlerts = res;       
      });
  }

  mouseDown()
  {
    this.isMouseDown = true;    
  }

  mouseUp()
  {
     this.isMouseDown = false;
  }

  drag() 
  {
    this.isDraging = true;    
  }

  dragOver()
  {
    this.isDraging = false;
  }

  @HostListener('document:mousemove', ['$event'])

  onMouseMove(event:MouseEvent) {
    if(this.isDraging && this.isMouseDown)
    {
      this.index = event.clientX;
    }
  }


  changeZoom()
  {    
    this.zoomBox = "0 0 "+this.salesZoom+" 300";
  }

}
