"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getInvoiceById } from "@/services/invoiceService";
import type { Invoice } from "@/types/invoice";

export default function InvoiceDetailsPage() {
    const params = useParams<{ id: string }>();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadInvoice() {
            try {
                const data = await getInvoiceById(Number(params.id));
                setInvoice(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load invoice.");
            } finally {
                setLoading(false);
            }
        }

        loadInvoice();
    }, [params.id]);

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/invoices"
                    className="mb-4 inline-block font-medium text-blue-600 hover:underline"
                >
                    ← Back to invoices
                </Link>

                {loading && <p className="text-gray-600">Loading invoice...</p>}

                {error && <p className="text-red-600">{error}</p>}

                {invoice && (
                    <div className="rounded-xl bg-white p-8 shadow">
                        <h1 className="mb-4 text-3xl font-bold text-gray-900">
                            Invoice #{invoice.id}
                        </h1>

                        <div className="space-y-2 text-gray-700">
                            <p>Customer: #{invoice.customerId}</p>
                            <p>
                                From quote:{" "}
                                <Link
                                    href={`/quotes/${invoice.quoteId}`}
                                    className="font-medium text-blue-600 hover:underline"
                                >
                                    Quote #{invoice.quoteId}
                                </Link>
                            </p>
                            <p>
                                Status:{" "}
                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                    {invoice.status}
                                </span>
                            </p>
                            <p>Total USD: ${Number(invoice.totalUsd).toFixed(2)}</p>
                            <p>
                                Total LBP:{" "}
                                {invoice.totalLbp != null
                                    ? `${Number(invoice.totalLbp).toLocaleString()} LBP`
                                    : "-"}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}