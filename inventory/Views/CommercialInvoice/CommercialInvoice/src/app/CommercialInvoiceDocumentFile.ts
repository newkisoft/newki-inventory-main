import { CommercialInvoice } from './CommercialInvoice';
import { DocumentFile } from './DocumentFile';


export class CommercialInvoiceDocumentFile {
  constructor() {    
    this.CommercialInvoiceId = 0;
    this.DocumentFileId = 0;
  }

  public File:DocumentFile;
  public CommercialInvoice:CommercialInvoice;
  public CommercialInvoiceId:number;
  public DocumentFileId:number;  
}
