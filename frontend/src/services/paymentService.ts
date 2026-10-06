import { apiFetch } from "@/lib/api";
import type { Payment } from "@/types/payment";

export async function createPayment(
    orderId: number,
    method: string
): Promise<Payment> {
    return apiFetch<Payment>(
        `/payments/${orderId}?method=${encodeURIComponent(method)}`,
        {
            method: "POST",
        }
    );
}

export async function getPaymentById(id: number): Promise<Payment> {
    return apiFetch<Payment>(`/payments/${id}`);
}

export async function getPaymentsByOrder(
    orderId: number
): Promise<Payment[]> {
    return apiFetch<Payment[]>(`/payments/order/${orderId}`);
}