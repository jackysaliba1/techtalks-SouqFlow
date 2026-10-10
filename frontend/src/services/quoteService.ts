import { request } from "@/services/request";
import type { Quote, CreateQuoteRequest } from "@/types/quote";

export function getQuotes() {
    return request<Quote[]>("/api/quotes");
}

export function getQuoteById(id: number) {
    return request<Quote>(`/api/quotes/${id}`);
}

export function createQuote(quote: CreateQuoteRequest) {
    return request<Quote>("/api/quotes", {
        method: "POST",
        body: JSON.stringify(quote),
    });
}

export function updateQuoteStatus(id: number, status: string) {
    return request<Quote>(`/api/quotes/${id}/status?status=${status}`, {
        method: "PATCH",
    });
}