export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    orderIds?: number[];
    balanceUsd: number;
}

export interface CreateCustomerRequest {
    name: string;
    email: string;
    phone: string;
}