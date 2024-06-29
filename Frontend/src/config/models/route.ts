import { Order } from "./order";
import { Supplier } from "./supplier";
import { SupplierOrder } from "./supplierOrder";

export interface Route {
    _id: string,
    routeName: String,
    routeDate: Date,
    routeID?: String,
    date?: String,
    sequence?: Number,
    deliveryStops: Order[],
    pickupStops: SupplierOrder[],
    start?: Supplier,
    end?: Supplier,
}