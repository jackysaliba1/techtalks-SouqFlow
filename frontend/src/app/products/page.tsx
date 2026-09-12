"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getProducts } from "@/services/productService";
import type { Product } from "@/types/product";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Products
                        </h1>

                        <p className="mt-1 text-gray-600">
                            Manage your inventory and product stock.
                        </p>
                    </div>

                    <Link
                        href="/products/add"
                        className="rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                    >
                        Add Product
                    </Link>
                </div>

                {loading && (
                    <p className="text-gray-600">
                        Loading products...
                    </p>
                )}

                {error && (
                    <p className="text-red-600">
                        {error}
                    </p>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className="rounded-xl bg-white p-8 text-center shadow">
                        <p className="text-gray-600">
                            No products found.
                        </p>
                    </div>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="overflow-x-auto rounded-xl bg-white shadow">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">USD Price</th>
                                <th className="px-6 py-4">LBP Price</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                            </thead>

                            <tbody>
                            {products.map((product) => {
                                const isLowStock =
                                    product.quantity <= product.lowStockThreshold;

                                return (
                                    <tr
                                        key={product.id}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {product.name}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {product.sku ?? "-"}
                                        </td>

                                        <td className="px-6 py-4">
                                            ${Number(product.priceUsd).toFixed(2)}
                                        </td>

                                        <td className="px-6 py-4">
                                            {Number(product.priceLbp).toLocaleString()} LBP
                                        </td>

                                        <td className="px-6 py-4">
                                            {product.quantity}
                                        </td>

                                        <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                                                        isLowStock
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}
                                                >
                                                    {isLowStock
                                                        ? "Low Stock"
                                                        : "In Stock"}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}