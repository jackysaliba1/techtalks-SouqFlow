"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getInvoiceById, cancelInvoice } from "@/services/invoiceService";
import type { Invoice } from "@/types/invoice";
import StatusBadge from "@/components/StatusBadge";

export default function InvoiceDetailsPage() {
    const params = useParams<{ id: string }>();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        async function loadInvoice() {
            try {
                setInvoice(await getInvoiceById(Number(params.id)));
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "Failed to load invoice.");
            } finally {
                setLoading(false);
            }
        }
        loadInvoice();
    }, [params.id]);

    async function handleCancel() {
        if (!invoice) return;
        if (!window.confirm("Cancel this invoice?")) return;
        try {
            setBusy(true);
            setError("");
            setInvoice(await cancelInvoice(invoice.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to cancel invoice.");
        } finally {
            setBusy(false);
        }
    }

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
                {error && <p className="mb-4 text-red-600">{error}</p>}

                {invoice && (
                    <div className="rounded-xl bg-white p-8 shadow">
                        <h1 className="mb-4 text-3xl font-bold text-gray-900">
                            {invoice.invoiceNumber}
                        </h1>

                        <div className="space-y-2 text-gray-700">
                            <p>Customer: {invoice.customerName}</p>
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
                                Status: <StatusBadge status={invoice.status} />
                            </p>
                            <p>Issued: {invoice.issueDate}</p>
                            <p>Due: {invoice.dueDate}</p>
                        </div>

                        {invoice.items && invoice.items.length > 0 && (
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
                                {invoice.items.map((item, i) => (
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
                        )}

                        {invoice.total != null && (
                            <p className="mt-4 text-xl font-semibold text-gray-900">
                                Total: ${Number(invoice.total).toFixed(2)}
                            </p>
                        )}

                        {invoice.status === "UNPAID" && (
                            <button
                                onClick={handleCancel}
                                disabled={busy}
                                className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                Cancel Invoice
                            </button>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}