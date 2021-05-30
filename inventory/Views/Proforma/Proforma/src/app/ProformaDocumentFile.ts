import { Proforma } from './Proforma';
import { DocumentFile } from './DocumentFile';


export class ProformaDocumentFile {
  constructor() {    
    this.ProformaId = 0;
    this.DocumentFileId = 0;
  }

  public File:DocumentFile;
  public Proforma:Proforma;
  public ProformaId:number;
  public DocumentFileId:number;  
}
