"use client";

import { useEffect, useState } from "react";
import { getCustomers } from "@/services/customerService";
import type { Customer } from "@/types/customer";

export default function BalancesPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCustomers() {
            try {
                const data = await getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to load customers:", error);
                setError("Failed to load customer balances.");
            } finally {
                setLoading(false);
            }
        }

        loadCustomers();
    }, []);

    return (
        <main className="p-6">
            <h1 className="mb-6 text-2xl font-bold">Customer Balances</h1>

            {loading ? (
                <p>Loading balances...</p>
            ) : error ? (
                <p className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
                    {error}
                </p>
            ) : customers.length === 0 ? (
                <p>No customers found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-3 text-left">Customer</th>
                            <th className="border p-3 text-left">Email</th>
                            <th className="border p-3 text-left">Phone</th>
                            <th className="border p-3 text-left">
                                Balance (USD)
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td className="border p-3">{customer.name}</td>
                                <td className="border p-3">{customer.email}</td>
                                <td className="border p-3">{customer.phone}</td>
                                <td className="border p-3 font-medium">
                                    ${customer.balanceUsd.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}