import { Box } from '../../../../Box/Box/src/app/Box';
import { Invoice } from './Invoice';


export class InvoiceBox {
  constructor() {
    this.Weight = 0;
    this.InvoiceId = 0;
    this.BoxId = 0;
  }

  public Box:Box;
  public Invoice:Invoice;
  public InvoiceId:number;
  public BoxId:number;
  public Weight:number;
}
