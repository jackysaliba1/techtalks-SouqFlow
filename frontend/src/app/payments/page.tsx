"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/services/orderService";
import { createPayment } from "@/services/paymentService";
import type { Order } from "@/types/order";

export default function PaymentsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [payingOrderId, setPayingOrderId] = useState<number | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadOrders() {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to load orders:", error);
                setMessage("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        }

        loadOrders();
    }, []);

    async function handlePayment(orderId: number) {
        setPayingOrderId(orderId);
        setMessage("");

        try {
            const payment = await createPayment(orderId, "CASH");

            setMessage(
                payment.status === "COMPLETED"
                    ? `Payment completed successfully for Order #${orderId}.`
                    : `Payment failed for Order #${orderId}.`
            );

            const updatedOrders = await getOrders();
            setOrders(updatedOrders);
        } catch (error) {
            console.error("Failed to create payment:", error);
            setMessage("Failed to process payment.");
        } finally {
            setPayingOrderId(null);
        }
    }

    return (
        <main className="p-6">
            <h1 className="mb-6 text-2xl font-bold">Record Payment</h1>

            {message && (
                <p className="mb-4 rounded border p-3">
                    {message}
                </p>
            )}

            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-3 text-left">Order ID</th>
                            <th className="border p-3 text-left">Customer ID</th>
                            <th className="border p-3 text-left">Amount (USD)</th>
                            <th className="border p-3 text-left">Status</th>
                            <th className="border p-3 text-left">Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="border p-3">{order.id}</td>
                                <td className="border p-3">{order.customerId}</td>
                                <td className="border p-3">
                                    ${order.totalUsd.toFixed(2)}
                                </td>
                                <td className="border p-3">{order.status}</td>
                                <td className="border p-3">
                                    <button
                                        onClick={() => handlePayment(order.id)}
                                        disabled={
                                            payingOrderId === order.id ||
                                            order.status === "PAID"
                                        }
                                        className="rounded bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {payingOrderId === order.id
                                            ? "Processing..."
                                            : order.status === "PAID"
                                                ? "Paid"
                                                : "Pay"}
                                    </button>
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