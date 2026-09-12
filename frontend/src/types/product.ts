export interface Product {
    id: number;
    name: string;
    description?: string;
    priceUsd: number;
    priceLbp: number;
    quantity: number;
    lowStockThreshold: number;
    sku?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateProductRequest {
    name: string;
    description?: string;
    priceUsd: number;
    priceLbp: number;
    quantity: number;
    lowStockThreshold: number;
    sku?: string;
}