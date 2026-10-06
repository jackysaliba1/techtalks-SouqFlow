export interface Payment {
    id: number;
    orderId: number;
    amountUsd: number;
    method: string;
    status: string;
    createdAt: string;
}