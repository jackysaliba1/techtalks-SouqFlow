"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { CreateProductRequest } from "@/types/product";
import { createProduct } from "@/services/productService";

export default function AddProductPage() {
    const router = useRouter();

    const [form, setForm] = useState<CreateProductRequest>({
        merchantId: 1,
        name: "",
        description: "",
        priceUsd: 0,
        priceLbp: 0,
        quantity: 0,
        lowStockThreshold: 5,
        sku: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        const numberFields = [
            "priceUsd",
            "priceLbp",
            "quantity",
            "lowStockThreshold",
        ];

        setForm((previousForm) => ({
            ...previousForm,
            [name]: numberFields.includes(name) ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await createProduct(form);

            router.push("/products");
        } catch (err) {
            console.error(err);
            setError("Failed to create product.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Add Product
                    </h1>

                    <p className="mt-1 text-gray-600">
                        Add a new product to your inventory.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Product Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Example: Maybelline Lipstick"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={form.description ?? ""}
                            onChange={handleChange}
                            placeholder="Product description"
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                        />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="priceUsd"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Price USD
                            </label>

                            <input
                                id="priceUsd"
                                name="priceUsd"
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.priceUsd}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="priceLbp"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Price LBP
                            </label>

                            <input
                                id="priceLbp"
                                name="priceLbp"
                                type="number"
                                min="0"
                                value={form.priceLbp}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="quantity"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Quantity
                            </label>

                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="0"
                                value={form.quantity}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="lowStockThreshold"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Low Stock Threshold
                            </label>

                            <input
                                id="lowStockThreshold"
                                name="lowStockThreshold"
                                type="number"
                                min="0"
                                value={form.lowStockThreshold}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="sku"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            SKU
                        </label>

                        <input
                            id="sku"
                            name="sku"
                            type="text"
                            value={form.sku ?? ""}
                            onChange={handleChange}
                            placeholder="Example: LIP-001"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Product"}
                    </button>
                </form>
            </div>
        </main>
    );
}