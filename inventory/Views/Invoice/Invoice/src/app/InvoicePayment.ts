import { Invoice } from './Invoice';


export class InvoicePayment {
  constructor() {
    this.InvoiceId = 0;
  }

  public Invoice:Invoice;
  public InvoiceId:number;
  public Amount:number;
  public ExchangeRate:number;
  public PaymentDate:Date;
  
}
