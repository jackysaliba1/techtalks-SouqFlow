export interface QuoteItem {
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal?: number;
}

export interface Quote {
    id: number;
    quoteNumber: string;
    customerId: number;
    customerName: string;
    status: string;
    issueDate: string;
    validUntil?: string;
    total: number;
    notes?: string;
    items: QuoteItem[];
}

export interface CreateQuoteRequest {
    customerId: number;
    validUntil?: string;
    notes?: string;
    items: { description: string; quantity: number; unitPrice: number }[];
}