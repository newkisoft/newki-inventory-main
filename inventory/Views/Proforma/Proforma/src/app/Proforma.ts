import { Customer } from "../../../../Customer/customers/src/app/Customer";
import { ProformaProformaItem } from "./ProformaProformaItem";
import { ProformaDocumentFile } from './ProformaDocumentFile';

export class Proforma {
  public ProformaId: number;
  public ProformaDate: string;
  public ProformaDueDate: string;
  public Customer: Customer;
  public TotalUsd:number;
  public Tax:number;
  public ExchangeRate:number;  
  public Discount:number;
  public Paid:number;
  public Kdv:number;
  public Currency:string;
  public ProformaProformaItems:Array<ProformaProformaItem>;  
  public Files:Array<ProformaDocumentFile>;
  public Comment:string;
  public Seller:string;
  public Consignee:string;
  public Buyer:string;
  public ValidUntil:string;
  public CountryOfBeneficiary:string;
  public FreightForwarder:string;
  public CountryOfOrigin:string;
  public CountryOfDestination:string;
  public PartialShipment:string;
  public TermsOfDelivery:string;
  public RelevantLocation:string;
  public TransportBy:string;
  public Port:string;
  public TermsOfPayment:string;
  public HsCode:string;
  public PackageDescription:string;
  public TotalGross:string;
  public Size:string;
  public ProformaNumber:string;
  public BankAccounts:string;
}
