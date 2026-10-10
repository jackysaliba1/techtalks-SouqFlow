"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getInvoices } from "@/services/invoiceService";
import type { Invoice } from "@/types/invoice";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadInvoices() {
            try {
                const data = await getInvoices();
                setInvoices(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load invoices.");
            } finally {
                setLoading(false);
            }
        }

        loadInvoices();
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Invoices
                    </h1>
                    <p className="mt-1 text-gray-600">
                        View invoices created from accepted quotes.
                    </p>
                </div>

                {loading && <p className="text-gray-600">Loading invoices...</p>}

                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && invoices.length === 0 && (
                    <div className="rounded-xl bg-white p-8 text-center shadow">
                        <p className="text-gray-600">No invoices found.</p>
                    </div>
                )}

                {!loading && !error && invoices.length > 0 && (
                    <div className="overflow-x-auto rounded-xl bg-white shadow">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-6 py-4">Invoice</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Total USD</th>
                                <th className="px-6 py-4">Total LBP</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Details</th>
                            </tr>
                            </thead>

                            <tbody>
                            {invoices.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="border-b last:border-b-0"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Invoice #{invoice.id}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        Customer #{invoice.customerId}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        ${Number(invoice.totalUsd).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {invoice.totalLbp != null
                                            ? `${Number(invoice.totalLbp).toLocaleString()} LBP`
                                            : "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/invoices/${invoice.id}`}
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