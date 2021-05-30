import { Pallet } from '../../../../Pallet/pallet/src/app/pallet';
import { Invoice } from './Invoice';


export class InvoicePallet {
  constructor() {
    this.Weight = 0;
    this.InvoiceId = 0;
    this.PalletId = 0;
  }

  public Pallet:Pallet;
  public Invoice:Invoice;
  public InvoiceId:number;
  public PalletId:number;
  public Weight:number;
}
