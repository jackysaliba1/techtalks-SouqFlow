export interface Quote {
    id: number;
    customerId: number;
    status: string;
    totalUsd: number;
    totalLbp?: number;
    productIds?: number[];
    quantities?: number[];
}

export interface CreateQuoteRequest {
    customerId: number;
    productIds: number[];
    quantities: number[];
}