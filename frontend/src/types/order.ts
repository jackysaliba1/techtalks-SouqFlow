export interface Order {
    id: number;
    customerId:number;
    status: string;
    totalUsd: number;
    totalLbp?: number;
    productIds?: number[];
    quantities?: number[];


}
export interface CreateOrderRequest{
    customerId:number;
    productIds: number[];
    quantities: number[];

}
