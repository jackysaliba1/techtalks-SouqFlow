import { apiFetch } from "@/lib/api";
import type { Customer, CreateCustomerRequest } from "@/types/customer";

export async function getCustomers(): Promise<Customer[]> {
    return apiFetch<Customer[]>("/api/customers");
}

export async function getCustomerById(id: number): Promise<Customer> {
    return apiFetch<Customer>(`/api/customers/${id}`);
}

export async function createCustomer(
    data: CreateCustomerRequest
): Promise<Customer> {
    return apiFetch<Customer>("/api/customers", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateCustomer(
    id: number,
    data: CreateCustomerRequest
): Promise<Customer> {
    return apiFetch<Customer>(`/api/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteCustomer(id: number): Promise<void> {
    return apiFetch<void>(`/api/customers/${id}`, {
        method: "DELETE",
    });
}