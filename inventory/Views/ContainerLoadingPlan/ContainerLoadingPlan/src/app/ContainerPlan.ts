import { ContainerPlanDocumentFile } from './ContainerPlanDocumentFile';
import { ContainerPlanPalletPlan } from './ContainerPlanPalletPlan';

export class ContainerPlan {
  public ContainerPlanId:number;
  public Name:string;
  public EstimateArrivalDate:Date;
  public Note:string;
  public PalletPlans:Array<ContainerPlanPalletPlan>;
  public Files:Array<ContainerPlanDocumentFile>;
}
