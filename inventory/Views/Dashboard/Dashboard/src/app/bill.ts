import { Vendor } from "../../../../Vendor/Vendors/src/app/Vendor";

export class Bill {
    BillId:number;    
    BillName:string;    
    VendorInvoiceNumber:string;    
    BillDate:Date;    
    BillDueDate:Date;
    Amount:number;
    UsdAmount:number;
    Paid:number;
    KDV:number;
    ExchangeRate:number;
    Vendor:Vendor;
    Comment:string;
    Files:any;
}
