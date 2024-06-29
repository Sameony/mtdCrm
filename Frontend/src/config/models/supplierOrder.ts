import { Order } from "./order";
import { Supplier } from "./supplier";

export interface SupplierOrder {
    _id:string;
    supplier: Supplier;
    order: Order;
    poID: string;
    createdAt: string;
    updatedAt: string;
}