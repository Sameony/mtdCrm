import { Address } from "./address";

export interface Customer {
    _id:string;
    email: string;
    firstname: string;
    lastname: string;
    phone: number;
    address?: Address;
  }