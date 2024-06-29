export interface RouteForm {
    routeName: String,
    routeDate: Date,
    routeID?: String,
    date?: String,
    sequence?: Number,
    deliveryStops: string[],
    pickupStops: string[],
    start?: string ,
    end?: string ,
}