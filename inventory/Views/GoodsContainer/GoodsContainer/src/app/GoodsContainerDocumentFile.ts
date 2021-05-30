import {  GoodsContainer } from './GoodsContainer';
import { DocumentFile } from './DocumentFile';


export class GoodsContainerDocumentFile {
  constructor() {    
    this.GoodsContainerId = 0;
    this.DocumentFileId = 0;
  }

  public File:DocumentFile;
  public GoodsContainer:GoodsContainer;
  public GoodsContainerId:number;
  public DocumentFileId:number;  
}
