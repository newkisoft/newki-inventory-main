import { Pallet } from '../../../../Pallet/pallet/src/app/pallet';
import { GoodsContainer } from './GoodsContainer';


export class GoodsContainerPallet {
  constructor() {    
    this.GoodsContainerId = 0;
    this.PalletId = 0;
  }

  public Pallet:Pallet;
  public GoodsContainer:GoodsContainer;
  public GoodsContainerId:number;
  public PalletId:number;  
}
