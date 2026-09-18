"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getOrderById } from "@/services/orderService";
import type { Order } from "@/types/order";

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = Number(params.id);

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOrder() {
            try {
                const data = await getOrderById(orderId);
                setOrder(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load order.");
            } finally {
                setLoading(false);
            }
        }

        if (orderId) {
            loadOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-100 p-6">
                <p className="text-gray-600">Loading order...</p>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="min-h-screen bg-gray-100 p-6">
                <p className="text-red-600">
                    {error || "Order not found."}
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Order #{order.id}
                        </h1>

                        <p className="mt-1 text-gray-600">
                            Order details
                        </p>
                    </div>

                    <Link
                        href="/orders"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Back to Orders
                    </Link>
                </div>

                <div className="space-y-5 rounded-xl bg-white p-6 shadow">
                    <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium text-gray-900">
                            Customer #{order.customerId}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Total USD</p>
                        <p className="font-medium text-gray-900">
                            ${Number(order.totalUsd).toFixed(2)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Total LBP</p>
                        <p className="font-medium text-gray-900">
                            {order.totalLbp != null
                                ? `${Number(order.totalLbp).toLocaleString()} LBP`
                                : "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Status</p>

                        <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
              {order.status}
            </span>
                    </div>
                </div>
            </div>
        </main>
    );
}