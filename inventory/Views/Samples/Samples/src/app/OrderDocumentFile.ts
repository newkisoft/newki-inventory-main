import { Order } from './Order';
import { DocumentFile } from './DocumentFile';


export class OrderDocumentFile {
  constructor() {    
    this.OrderId = 0;
    this.DocumentFileId = 0;
  }

  public File:DocumentFile;
  public Order:Order;
  public OrderId:number;
  public DocumentFileId:number;  
}
