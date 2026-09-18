"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getOrders } from "@/services/orderService";
import type { Order } from "@/types/order";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOrders() {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        }

        loadOrders();
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Orders
                        </h1>

                        <p className="mt-1 text-gray-600">
                            View and manage customer orders.
                        </p>
                    </div>

                    <Link
                        href="/orders/add"
                        className="rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                    >
                        Create Order
                    </Link>
                </div>

                {loading && (
                    <p className="text-gray-600">
                        Loading orders...
                    </p>
                )}

                {error && (
                    <p className="text-red-600">
                        {error}
                    </p>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="rounded-xl bg-white p-8 text-center shadow">
                        <p className="text-gray-600">
                            No orders found.
                        </p>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div className="overflow-x-auto rounded-xl bg-white shadow">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-6 py-4">Order</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Total USD</th>
                                <th className="px-6 py-4">Total LBP</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Details</th>
                            </tr>
                            </thead>

                            <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b last:border-b-0"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Order #{order.id}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        Customer #{order.customerId}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        ${Number(order.totalUsd).toFixed(2)}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {order.totalLbp != null
                                            ? `${Number(order.totalLbp).toLocaleString()} LBP`
                                            : "-"}
                                    </td>

                                    <td className="px-6 py-4">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                        {order.status}
                      </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/orders/${order.id}`}
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