import { Address } from "./address";

export interface CustomerForm {
    email: string;
    firstname: string;
    lastname: string;
    phone: number;
    address?: Address;
  }