export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    orderIds?: number[];
}

export interface CreateCustomerRequest {
    name: string;
    email: string;
    phone: string;
}