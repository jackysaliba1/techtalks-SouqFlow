"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getQuotes } from "@/services/quoteService";
import type { Quote } from "@/types/quote";
import StatusBadge from "@/components/StatusBadge";

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadQuotes() {
            try {
                setQuotes(await getQuotes());
            } catch (err) {
                console.error(err);
                setError("Failed to load quotes.");
            } finally {
                setLoading(false);
            }
        }
        loadQuotes();
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
                        <p className="mt-1 text-gray-600">
                            View and manage customer quotes.
                        </p>
                    </div>
                    <Link
                        href="/quotes/add"
                        className="rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                    >
                        Create Quote
                    </Link>
                </div>

                {loading && <p className="text-gray-600">Loading quotes...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && quotes.length === 0 && (
                    <div className="rounded-xl bg-white p-8 text-center shadow">
                        <p className="text-gray-600">No quotes found.</p>
                    </div>
                )}

                {!loading && !error && quotes.length > 0 && (
                    <div className="overflow-x-auto rounded-xl bg-white shadow">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-6 py-4">Quote</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Valid until</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Details</th>
                            </tr>
                            </thead>
                            <tbody>
                            {quotes.map((quote) => (
                                <tr key={quote.id} className="border-b last:border-b-0">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {quote.quoteNumber}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {quote.customerName}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        ${Number(quote.total).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {quote.validUntil ?? "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={quote.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/quotes/${quote.id}`}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}