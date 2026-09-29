"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import type { Product } from "@/types/product";

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch {
                setError("Failed to load inventory.");
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    function getStockStatus(product: Product) {
        if (product.quantity <= 0) {
            return "Out of Stock";
        }

        if (product.quantity <= product.lowStockThreshold) {
            return "Low Stock";
        }

        return "In Stock";
    }

    function getStatusClass(status: string) {
        if (status === "Out of Stock") {
            return "bg-red-100 text-red-700";
        }

        if (status === "Low Stock") {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-green-100 text-green-700";
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold">Inventory</h1>

            <p className="mt-2 text-gray-600">
                Manage and monitor your product stock.
            </p>

            {loading && <p className="mt-6">Loading inventory...</p>}

            {error && <p className="mt-6 text-red-600">{error}</p>}

            {!loading && !error && (
                <div className="mt-8 overflow-hidden rounded-lg border">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left">Product</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">Stock</th>
                            <th className="p-4 text-left">Status</th>
                        </tr>
                        </thead>

                        <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-4 text-center">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                const status = getStockStatus(product);

                                return (
                                    <tr key={product.id} className="border-t">
                                        <td className="p-4">{product.name}</td>

                                        <td className="p-4">
                                            ${product.priceUsd.toFixed(2)}
                                        </td>

                                        <td className="p-4">{product.quantity}</td>

                                        <td className="p-4">
                        <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                                status
                            )}`}
                        >
                          {status}
                        </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}