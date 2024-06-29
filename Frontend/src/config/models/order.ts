import { Address } from "./address";
import { Customer } from "./customer";

export interface Order {
    _id: string;
    customer: Customer;
    products: any[];
    ship_method: string;
    ship_address: Address;
    comment: string;
    added_cost: number;
    discount: number;
    tax: number;
    amount_total: number;
    due_amount: number;
    paid_amount: number;
    sub_total: number;
    status: string;
    payments: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}
  