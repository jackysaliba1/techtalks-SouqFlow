"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { getQuoteById, updateQuoteStatus } from "@/services/quoteService";
import { createInvoiceFromQuote } from "@/services/invoiceService";
import type { Quote } from "@/types/quote";
import StatusBadge from "@/components/StatusBadge";

function defaultDueDate() {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
}

export default function QuoteDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const [dueDate, setDueDate] = useState(defaultDueDate());

    useEffect(() => {
        async function loadQuote() {
            try {
                setQuote(await getQuoteById(Number(params.id)));
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "Failed to load quote.");
            } finally {
                setLoading(false);
            }
        }
        loadQuote();
    }, [params.id]);

    async function handleAccept() {
        if (!quote) return;
        try {
            setBusy(true);
            setError("");
            setQuote(await updateQuoteStatus(quote.id, "ACCEPTED"));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update status.");
        } finally {
            setBusy(false);
        }
    }

    async function handleConvert() {
        if (!quote) return;
        try {
            setBusy(true);
            setError("");
            const invoice = await createInvoiceFromQuote(quote.id, dueDate);
            router.push(`/invoices/${invoice.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to convert quote.");
            setBusy(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/quotes"
                    className="mb-4 inline-block font-medium text-blue-600 hover:underline"
                >
                    ← Back to quotes
                </Link>

                {loading && <p className="text-gray-600">Loading quote...</p>}
                {error && <p className="mb-4 text-red-600">{error}</p>}

                {quote && (
                    <div className="rounded-xl bg-white p-8 shadow">
                        <h1 className="mb-4 text-3xl font-bold text-gray-900">
                            {quote.quoteNumber}
                        </h1>

                        <div className="space-y-2 text-gray-700">
                            <p>Customer: {quote.customerName}</p>
                            <p>
                                Status: <StatusBadge status={quote.status} />
                            </p>
                            <p>Issued: {quote.issueDate}</p>
                            <p>Valid until: {quote.validUntil ?? "-"}</p>
                            {quote.notes && <p>Notes: {quote.notes}</p>}
                        </div>

                        <table className="mt-6 w-full text-left">
                            <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Qty</th>
                                <th className="px-4 py-3">Unit price</th>
                                <th className="px-4 py-3">Line total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {quote.items.map((item, i) => (
                                <tr key={i} className="border-b last:border-b-0">
                                    <td className="px-4 py-3">{item.description}</td>
                                    <td className="px-4 py-3">{item.quantity}</td>
                                    <td className="px-4 py-3">
                                        ${Number(item.unitPrice).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                                        ${Number(item.lineTotal ?? 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <p className="mt-4 text-xl font-semibold text-gray-900">
                            Total: ${Number(quote.total).toFixed(2)}
                        </p>

                        {quote.status === "DRAFT" && (
                            <button
                                onClick={handleAccept}
                                disabled={busy}
                                className="mt-6 rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                                Mark as Accepted
                            </button>
                        )}

                        {quote.status === "ACCEPTED" && (
                            <div className="mt-6 flex flex-wrap items-end gap-3">
                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Invoice due date
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="rounded-lg border p-3"
                                    />
                                </div>
                                <button
                                    onClick={handleConvert}
                                    disabled={busy || !dueDate}
                                    className="rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {busy ? "Converting..." : "Convert to Invoice"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}