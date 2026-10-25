import { request } from "@/services/request";
import type { Invoice } from "@/types/invoice";

export function getInvoices() {
    return request<Invoice[]>("/api/invoices");
}

export function getInvoiceById(id: number) {
    return request<Invoice>(`/api/invoices/${id}`);
}

export function createInvoiceFromQuote(quoteId: number, dueDate: string) {
    return request<Invoice>(`/api/invoices/from-quote/${quoteId}`, {
        method: "POST",
        body: JSON.stringify({ dueDate }),
    });
}

export function cancelInvoice(id: number) {
    return request<Invoice>(`/api/invoices/${id}/cancel`, {
        method: "PATCH",
    });
}