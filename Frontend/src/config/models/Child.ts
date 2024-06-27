interface Size {
    L?: number;
    W?: number;
    H?: number;
}

export interface Child {
    SKU: string;
    name: string;
    color: string;
    selling_price: number;
    sale_price: number;
    cost_price: number;
    product_size?: Size;
    shipping_size?: Size;
    weight?: number;
    status: string;
    image?: any;
    imageUrl?: any;
    parentName?: string;
    _id?: string;
    parent_id?: string;
}