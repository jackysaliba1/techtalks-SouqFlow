import type { Quote } from "@/types/quote";
import type { Invoice } from "@/types/invoice";

export const USE_MOCK = true;

export const mockQuotes: Quote[] = [
    {
        id: 1,
        customerId: 1,
        status: "ACCEPTED",
        totalUsd: 20,
        totalLbp: 1800000,
        productIds: [1],
        quantities: [2],
    },
    {
        id: 2,
        customerId: 2,
        status: "DRAFT",
        totalUsd: 45,
        totalLbp: 4050000,
        productIds: [1, 2],
        quantities: [1, 3],
    },
];

export const mockInvoices: Invoice[] = [];