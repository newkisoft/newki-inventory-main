import { CommercialInvoice } from './CommercialInvoice';
import {CommercialInvoiceItem} from './CommercialInvoiceItem';


export class CommercialInvoiceCommercialInvoiceItem {
  constructor() {
    this.Weight = 0;
    this.Price = 0;
    this.CommercialInvoiceId = 0;
    this.CommercialInvoiceItemId = 0;
  }

  public CommercialInvoiceItem:CommercialInvoiceItem;
  public CommercialInvoice:CommercialInvoice;
  public CommercialInvoiceId:number;
  public CommercialInvoiceItemId:number;
  public Weight:number;
  public Price:number;
}
