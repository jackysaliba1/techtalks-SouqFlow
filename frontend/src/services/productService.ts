import { apiFetch } from "@/lib/api";
import type {
    Product,
    CreateProductRequest,
} from "@/types/product";

export async function getProducts(): Promise<Product[]> {
    return apiFetch<Product[]>("/product");
}

export async function createProduct(
    product: CreateProductRequest
): Promise<Product> {
    return apiFetch<Product>("/product", {
        method: "POST",
        body: JSON.stringify(product),
    });
}

export async function deleteProduct(id: number): Promise<void> {
    return apiFetch<void>(`/product/${id}`, {
        method: "DELETE",
    });
}