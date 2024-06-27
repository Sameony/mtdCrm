export interface Supplier {
    _id?: string;
    name: string;
    phoneNumber1: string;
    phoneNumber2?: string;
    emailID: string;
    pickupLocation: string;
    pickupGoogleMapLink: string;
    supplier_id?:string;
  }