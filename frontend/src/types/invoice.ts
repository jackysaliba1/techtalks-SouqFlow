export interface Invoice {
    id: number;
    quoteId: number;
    customerId: number;
    status: string;
    totalUsd: number;
    totalLbp?: number;
}