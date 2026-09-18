import { apiFetch}   from "@/lib/api";
import type {
    Order,
    CreateOrderRequest,
} from "@/types/order";
export async function getOrders(): Promise<Order[]> {
    return apiFetch<Order[]>("/orders");
}
export async function getOrderById(id: number): Promise<Order>{
    return apiFetch<Order>(`/orders/${id}`);
}
export async function createOrder(
    order: CreateOrderRequest
): Promise<Order>{
    return apiFetch<Order>("/orders",{
        method: "POST",
        body: JSON.stringify(order),
    });
}