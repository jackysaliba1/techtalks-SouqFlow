export interface Order {
    id: number;
    customerId:number;
    merchantId:number;
    orderDate?:string;
    totalAmount:number;
    status:string;

}
export interface CreateOrderRequest{
    customerId:number;
    totalAmount:number;
    status:string;

}
