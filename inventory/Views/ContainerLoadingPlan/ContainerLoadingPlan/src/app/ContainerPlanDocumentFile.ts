import { ContainerPlan } from './ContainerPlan';
import { DocumentFile } from './DocumentFile';


export class ContainerPlanDocumentFile {
  constructor() {    
    this.ContainerPlanId = 0;
    this.DocumentFileId = 0;
  }

  public File:DocumentFile;
  public ContainerPlan:ContainerPlan;
  public ContainerPlanId:number;
  public DocumentFileId:number;  
}
