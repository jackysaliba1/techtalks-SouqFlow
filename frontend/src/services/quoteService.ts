import { apiFetch } from "@/lib/api";
import type { Quote, CreateQuoteRequest } from "@/types/quote";
import type { Invoice } from "@/types/invoice";
import { USE_MOCK, mockQuotes, mockInvoices } from "@/services/mockData";

export async function getQuotes(): Promise<Quote[]> {
    if (USE_MOCK) return [...mockQuotes];
    return apiFetch<Quote[]>("/quotes");
}

export async function getQuoteById(id: number): Promise<Quote> {
    if (USE_MOCK) {
        const quote = mockQuotes.find((q) => q.id === id);
        if (!quote) throw new Error("Quote not found");
        return quote;
    }
    return apiFetch<Quote>(`/quotes/${id}`);
}

export async function createQuote(
    quote: CreateQuoteRequest
): Promise<Quote> {
    if (USE_MOCK) {
        const newQuote: Quote = {
            id: mockQuotes.length + 1,
            customerId: quote.customerId,
            status: "DRAFT",
            totalUsd: 0,
            totalLbp: 0,
            productIds: quote.productIds,
            quantities: quote.quantities,
        };
        mockQuotes.push(newQuote);
        return newQuote;
    }
    return apiFetch<Quote>("/quotes", {
        method: "POST",
        body: JSON.stringify(quote),
    });
}

export async function convertQuoteToInvoice(id: number): Promise<Invoice> {
    if (USE_MOCK) {
        const quote = mockQuotes.find((q) => q.id === id);
        if (!quote) throw new Error("Quote not found");
        const invoice: Invoice = {
            id: mockInvoices.length + 1,
            quoteId: quote.id,
            customerId: quote.customerId,
            status: "UNPAID",
            totalUsd: quote.totalUsd,
            totalLbp: quote.totalLbp,
        };
        mockInvoices.push(invoice);
        return invoice;
    }
    return apiFetch<Invoice>(`/quotes/${id}/convert`, {
        method: "POST",
    });
}