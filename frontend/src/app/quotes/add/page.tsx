"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createQuote } from "@/services/quoteService";

interface Line {
    description: string;
    quantity: string;
    unitPrice: string;
}

const emptyLine: Line = { description: "", quantity: "1", unitPrice: "" };

export default function AddQuotePage() {
    const router = useRouter();
    const [customerId, setCustomerId] = useState("");
    const [validUntil, setValidUntil] = useState("");
    const [notes, setNotes] = useState("");
    const [lines, setLines] = useState<Line[]>([{ ...emptyLine }]);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const total = lines.reduce(
        (sum, l) => sum + Number(l.quantity || 0) * Number(l.unitPrice || 0),
        0
    );

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
                (l) =>
                    !l.description.trim() ||
                    Number(l.quantity) <= 0 ||
                    l.unitPrice === "" ||
                    Number(l.unitPrice) < 0
            )
        ) {
            setError(
                "Each line needs a description, a quantity above 0, and a price of 0 or more."
            );
            return;
        }

        try {
            setSaving(true);
            const quote = await createQuote({
                customerId: Number(customerId),
                ...(validUntil ? { validUntil } : {}),
                ...(notes.trim() ? { notes: notes.trim() } : {}),
                items: lines.map((l) => ({
                    description: l.description.trim(),
                    quantity: Number(l.quantity),
                    unitPrice: Number(l.unitPrice),
                })),
            });
            router.push(`/quotes/${quote.id}`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to create quote.");
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
                            Valid until
                        </label>
                        <input
                            type="date"
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Items
                        </label>
                        {lines.map((line, index) => (
                            <div key={index} className="mb-2 flex gap-2">
                                <input
                                    placeholder="Description"
                                    value={line.description}
                                    onChange={(e) =>
                                        updateLine(index, "description", e.target.value)
                                    }
                                    className="w-full rounded-lg border p-3"
                                />
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    value={line.quantity}
                                    onChange={(e) =>
                                        updateLine(index, "quantity", e.target.value)
                                    }
                                    className="w-24 rounded-lg border p-3"
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Price"
                                    value={line.unitPrice}
                                    onChange={(e) =>
                                        updateLine(index, "unitPrice", e.target.value)
                                    }
                                    className="w-28 rounded-lg border p-3"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setLines([...lines, { ...emptyLine }])}
                            className="font-medium text-blue-600 hover:underline"
                        >
                            + Add item
                        </button>
                    </div>

                    <p className="font-semibold text-gray-900">
                        Total: ${total.toFixed(2)}
                    </p>

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