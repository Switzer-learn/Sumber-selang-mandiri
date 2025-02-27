export interface dbProducts {
    id?: string;
    name: string;
    type: string;
    unit: string;
    description: string;
    stock: number | 0;
    avg_buy_price: number | 0;
    sell_price:number;    
    created_at?: string;
    last_updated?: string;
}

export interface dbUpdateProductPricenStock{
    id: string;
    avg_buy_price: number;
    stock: number;
}

export interface dbProductsPurchases {
    id?: string;
    product_id: string;
    purchase_date?: string;
    buying_price: number;
    quantity_purchased: number;
}

export interface dbTransactions {
    id: string;
    customer_id: string;
    cashier_id: string;
    payment_type: string;
    grand_total: number;
    sale_date?: string;
    created_at?: string;
}

export interface dbTransactionsItems {
    id: string;
    transaction_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    discount: number;
    created_at?: string;
}

export interface dbCustomers {
    id?: string;
    name: string;
    phone_number: string;
    address: string;
    cash_bon?: number;
    created_at?: string;
}

export interface dbUsers {
    id?: string;
    username: string;
    role: string;
    created_at?: string;
}

export interface credentials {
    email:string;
    password:string;
}