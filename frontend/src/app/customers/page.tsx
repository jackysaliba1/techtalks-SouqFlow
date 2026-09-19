"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { Customer } from "@/types/customer";
import { getCustomers } from "@/services/customerService";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getCustomers()
            .then(setCustomers)
            .catch((err) => {
                console.error(err);
                setError("Failed to load customers.");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Customers
                    </h1>

                    <Link
                        href="/customers/add"
                        className="rounded-lg bg-black px-4 py-2 font-semibold text-white hover:bg-gray-800"
                    >
                        + Add Customer
                    </Link>
                </div>

                {loading && <p className="text-gray-600">Loading...</p>}

                {error && <p className="text-sm text-red-600">{error}</p>}

                {!loading && !error && (
                    <div className="overflow-hidden rounded-xl bg-white shadow">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-sm font-semibold text-gray-700">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customers.map((c) => (
                                <tr key={c.id} className="border-t">
                                    <td className="px-4 py-3">{c.name}</td>
                                    <td className="px-4 py-3">{c.email}</td>
                                    <td className="px-4 py-3">{c.phone}</td>
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/customers/${c.id}/edit`}
                                            className="text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No customers yet.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}