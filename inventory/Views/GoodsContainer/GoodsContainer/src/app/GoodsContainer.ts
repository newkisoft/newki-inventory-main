import { Customer } from "../../../../Customer/customers/src/app/Customer";
import { GoodsContainerPallet } from "./GoodsContainerPallet";
import { GoodsContainerDocumentFile } from './GoodsContainerDocumentFile';

export class GoodsContainer {
  
  public GoodsContainerId:number;
  public Name:string;
  public ImportDate:Date;
  public ReleaseDate:Date;
  public Note:string;  
  public GoodsContainerPallets:Array<GoodsContainerPallet>;
  public Files:Array<GoodsContainerDocumentFile>;
}
