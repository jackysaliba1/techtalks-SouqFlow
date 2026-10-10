import { apiFetch } from "@/lib/api";
import type { Invoice } from "@/types/invoice";
import { USE_MOCK, mockInvoices } from "@/services/mockData";

export async function getInvoices(): Promise<Invoice[]> {
    if (USE_MOCK) return [...mockInvoices];
    return apiFetch<Invoice[]>("/invoices");
}

export async function getInvoiceById(id: number): Promise<Invoice> {
    if (USE_MOCK) {
        const invoice = mockInvoices.find((i) => i.id === id);
        if (!invoice) throw new Error("Invoice not found");
        return invoice;
    }
    return apiFetch<Invoice>(`/invoices/${id}`);
}