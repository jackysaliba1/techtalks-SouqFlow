import { apiFetch } from "@/lib/api";
import type { Customer } from "@/types/customer";

export async function getCustomers(): Promise<Customer[]> {
    return apiFetch<Customer[]>("/api/customers");
}