import type { QuoteItem } from "@/types/quote";

export interface Invoice {
    id: number;
    invoiceNumber: string;
    customerId: number;
    customerName: string;
    quoteId: number;
    status: string;
    issueDate: string;
    dueDate: string;
    total?: number;
    items?: QuoteItem[];
}