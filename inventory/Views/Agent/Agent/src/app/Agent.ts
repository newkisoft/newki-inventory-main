import { Customer } from "../../../../Customer/customers/src/app/Customer";
import {AgentCustomer} from "./AgentCustomer";

export class Agent {
    public AgentId: number;
    public Name: String;
    public Address: String;
    public City: String;
    public ZipCode: String;
    public Phone: String;
    public MobilePhone: String;
    public Email: String;
    public Website: String;
    public Vergi: String;
    public Customers: Array<AgentCustomer>;
  }
  