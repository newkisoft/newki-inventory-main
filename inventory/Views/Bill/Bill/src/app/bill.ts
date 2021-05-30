import { Vendor } from "../../../../Vendor/Vendors/src/app/Vendor";
import { BillDocumentFile } from './BillDocumentFile';

export class Bill {
    BillId:number;    
    BillName:string;    
    VendorInvoiceNumber:string;    
    BillDate:Date;    
    BillDueDate:Date;
    Amount:number;
    UsdAmount:number;
    EuroAmount:number;
    Paid:number;
    KDV:number;
    ExchangeRate:number;
    Vendor:Vendor;
    Comment:string;
    Currency:string;
    Files:Array<BillDocumentFile>;
}
