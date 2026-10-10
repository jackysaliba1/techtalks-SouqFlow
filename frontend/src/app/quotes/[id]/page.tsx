"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
    getQuoteById,
    convertQuoteToInvoice,
} from "@/services/quoteService";
import type { Quote } from "@/types/quote";

export default function QuoteDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [converting, setConverting] = useState(false);

    useEffect(() => {
        async function loadQuote() {
            try {
                const data = await getQuoteById(Number(params.id));
                setQuote(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load quote.");
            } finally {
                setLoading(false);
            }
        }

        loadQuote();
    }, [params.id]);

    async function handleConvert() {
        if (!quote) return;
        try {
            setConverting(true);
            setError("");
            const invoice = await convertQuoteToInvoice(quote.id);
            router.push(`/invoices/${invoice.id}`);
        } catch (err) {
            console.error(err);
            setError("Failed to convert quote to invoice.");
        } finally {
            setConverting(false);
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
                            Quote #{quote.id}
                        </h1>

                        <div className="space-y-2 text-gray-700">
                            <p>Customer: #{quote.customerId}</p>
                            <p>
                                Status:{" "}
                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                    {quote.status}
                                </span>
                            </p>
                            <p>Total USD: ${Number(quote.totalUsd).toFixed(2)}</p>
                            <p>
                                Total LBP:{" "}
                                {quote.totalLbp != null
                                    ? `${Number(quote.totalLbp).toLocaleString()} LBP`
                                    : "-"}
                            </p>
                        </div>

                        {quote.productIds && quote.quantities && (
                            <table className="mt-6 w-full text-left">
                                <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Quantity</th>
                                </tr>
                                </thead>
                                <tbody>
                                {quote.productIds.map((productId, i) => (
                                    <tr key={i} className="border-b last:border-b-0">
                                        <td className="px-4 py-3">Product #{productId}</td>
                                        <td className="px-4 py-3">{quote.quantities?.[i]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}

                        {quote.status === "ACCEPTED" && (
                            <button
                                onClick={handleConvert}
                                disabled={converting}
                                className="mt-6 rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                                {converting ? "Converting..." : "Convert to Invoice"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}