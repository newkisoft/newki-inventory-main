import { Customer } from "../../../../Customer/customers/src/app/Customer";
import { InvoicePallet } from "./InvoicePallet";
import { InvoiceBox } from "./InvoiceBox";
import { InvoiceDocumentFile } from './InvoiceDocumentFile';
import { InvoicePayment } from "./InvoicePayment";

export class Invoice {
  public InvoiceId: number;
  public ProformaId:number;
  public InvoiceDate: string;
  public InvoiceDueDate: string;
  public Customer: Customer;
  public TotalUsd:number;
  public Tax:number;
  public ExchangeRate:number;
  public StateInvoiceNumber:number;
  public Discount:number;
  public Paid:number;
  public Kdv:number;
  public Currency:string;
  public InvoicePallets:Array<InvoicePallet>;
  public InvoiceBoxes:Array<InvoiceBox>;
  public Payments:Array<InvoicePayment>;
  public Files:Array<InvoiceDocumentFile>;
  public Comment:string;
  public DriverName:string;
  public DriverRegistrationNumber:string;
  public HasOfficialInvoice:boolean;
}
