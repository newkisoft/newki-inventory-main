import { ProformaItem } from '../../../../ProformaItem/ProformaItem/src/app/ProformaItem';
import { ContainerPlan } from './ContainerPlan';


export class ProformaProformaItem {
  constructor() {
    this.Weight = 0;
    this.Price = 0;
    this.ProformaId = 0;
    this.ProformaItemId = 0;
  }

  public ProformaItem:ProformaItem;
  public ContainerPlan:ContainerPlan;
  public ProformaId:number;
  public ProformaItemId:number;
  public Weight:number;
  public Price:number;
}
