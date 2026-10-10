"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createQuote } from "@/services/quoteService";

interface Line {
    productId: string;
    quantity: string;
}

export default function AddQuotePage() {
    const router = useRouter();
    const [customerId, setCustomerId] = useState("");
    const [lines, setLines] = useState<Line[]>([
        { productId: "", quantity: "1" },
    ]);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    function updateLine(index: number, field: keyof Line, value: string) {
        setLines(
            lines.map((line, i) =>
                i === index ? { ...line, [field]: value } : line
            )
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!customerId || Number(customerId) <= 0) {
            setError("Please enter a valid customer ID.");
            return;
        }

        if (
            lines.some(
                (l) => !l.productId || Number(l.productId) <= 0 || Number(l.quantity) <= 0
            )
        ) {
            setError("Each line needs a product ID and a quantity greater than 0.");
            return;
        }

        try {
            setSaving(true);
            const quote = await createQuote({
                customerId: Number(customerId),
                productIds: lines.map((l) => Number(l.productId)),
                quantities: lines.map((l) => Number(l.quantity)),
            });
            router.push(`/quotes/${quote.id}`);
        } catch (err) {
            console.error(err);
            setError("Failed to create quote.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
                <h1 className="mb-6 text-3xl font-bold text-gray-900">
                    Create Quote
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Customer ID
                        </label>
                        <input
                            type="number"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Products
                        </label>
                        {lines.map((line, index) => (
                            <div key={index} className="mb-2 flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Product ID"
                                    value={line.productId}
                                    onChange={(e) =>
                                        updateLine(index, "productId", e.target.value)
                                    }
                                    className="w-full rounded-lg border p-3"
                                />
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={line.quantity}
                                    onChange={(e) =>
                                        updateLine(index, "quantity", e.target.value)
                                    }
                                    className="w-32 rounded-lg border p-3"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                setLines([...lines, { productId: "", quantity: "1" }])
                            }
                            className="font-medium text-blue-600 hover:underline"
                        >
                            + Add product
                        </button>
                    </div>

                    {error && <p className="text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Quote"}
                    </button>
                </form>
            </div>
        </main>
    );
}