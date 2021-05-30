import { Pallet } from "../../../../Pallet/pallet/src/app/pallet";

export class Box {
  public BoxId: number;
  public Pallet:Pallet;
  public PalletId:number;  
  public Barcode: string;  
  public Weight: number;
  public RemainWeight: number;
  public Sold: string;
  public Price:number;
  public Note:string;
  public YarnType:string;
  public Denier:number;
  public Filament:number;
  public Intermingle:string;
  public Color:string;
  public ColorCode:string;
  public BobbinSize:string;
  public Selected:boolean;
  public IsDelivered:boolean;
  public DeliveryDate:Date;
}
