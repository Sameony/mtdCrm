import { Address } from "./address";

export interface OrderFormState {
    customer: string;
    ship_method: string;
    ship_address: Address;
    comment: string;
    added_cost: number;
    discount: number;
    tax: number;
    amount_total: number;
    due_amount: number;
    paid_amount: number;
    status: string;
    sub_total: number;
    expected_delivery: Date;
  }
  