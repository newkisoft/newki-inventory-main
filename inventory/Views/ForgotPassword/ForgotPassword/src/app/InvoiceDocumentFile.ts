import { Invoice } from './Invoice';
import { DocumentFile } from './DocumentFile';


export class InvoiceDocumentFile {
  constructor() {    
    this.InvoiceId = 0;
    this.DocumentFileId = 0;
  }

  public File:DocumentFile;
  public Invoice:Invoice;
  public InvoiceId:number;
  public DocumentFileId:number;  
}
