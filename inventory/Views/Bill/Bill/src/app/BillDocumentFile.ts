import { Bill } from './bill';
import { DocumentFile } from './DocumentFile';


export class BillDocumentFile {
  constructor() {    
    this.BillId = 0;
    this.DocumentFileId = 0;
  }

  public File:DocumentFile;
  public Bill:Bill;
  public BillId:number;
  public DocumentFileId:number;  
}
