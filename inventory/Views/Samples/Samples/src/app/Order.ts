import { Customer } from "../../../../Customer/customers/src/app/Customer";
import { OrderDocumentFile } from './OrderDocumentFile';

export class Order {
  public OrderId: number;
  public OrderDate: string;
  public Customer: Customer;
  public Files:Array<OrderDocumentFile>;
  public Comment:string;
}
