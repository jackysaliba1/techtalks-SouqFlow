"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getOrders } from "@/services/orderService";
import type { Order } from "@/types/order";

type Filter = "all" | "paid" | "pending" | "cancelled";

const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "paid", label: "Paid" },
    { key: "pending", label: "Pending" },
    { key: "cancelled", label: "Cancelled" },
];

const STATUS_STYLE: Record<string, { box: string; dot: string }> = {
    paid: { box: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
    pending: { box: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
    cancelled: { box: "bg-red-50 text-red-600", dot: "bg-red-500" },
};

const FALLBACK_STYLE = { box: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };

const money = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const customerCode = (id: number) => `CUS-${String(id).padStart(3, "0")}`;

// "PAID", "paid", "Paid" -> "paid"
const normalize = (s: string | undefined) => String(s ?? "").trim().toLowerCase();

const label = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "—");

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState<Filter>("all");

    // ---- your original data loading, unchanged ----
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

    const visible = useMemo(
        () => (filter === "all" ? orders : orders.filter((o) => normalize(o.status) === filter)),
        [orders, filter]
    );

    return (
        <div className="min-h-screen bg-[#f3f6f4]">
            <main className="mx-auto max-w-5xl px-6 py-8">
                {/* ---------- Heading ---------- */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0f8466]">
                            Sales
                        </p>
                        <h1 className="mt-1 text-4xl font-bold text-[#0b2a22]">Orders</h1>
                        <p className="mt-1 text-xs text-gray-500">Track every order from pending to paid.</p>
                    </div>

                    <Link
                        href="/orders/add"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            height: 44,
                            padding: "0 20px",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            backgroundImage: "linear-gradient(90deg, #0f6b55 0%, #0a3328 100%)",
                        }}
                        className="rounded-xl bg-[#0f6b55] text-xs font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Create Order
                    </Link>
                </div>

                {/* ---------- Card ---------- */}
                <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    {loading ? (
                        <p className="px-3 py-10 text-center text-sm text-gray-500">Loading orders...</p>
                    ) : error ? (
                        <p className="m-2 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </p>
                    ) : orders.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-sm font-semibold text-gray-800">No orders yet</p>
                            <p className="mt-1 text-xs text-gray-500">Create your first order and it will show up here.</p>
                            <Link
                                href="/orders/add"
                                style={{ display: "inline-block", textDecoration: "none" }}
                                className="mt-4 rounded-lg bg-[#0f6b55] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0b4a3b]"
                            >
                                + Create order
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Filter tabs */}
                            <div className="flex flex-wrap gap-1 px-1">
                                {FILTERS.map((f) => (
                                    <button
                                        key={f.key}
                                        onClick={() => setFilter(f.key)}
                                        className={`cursor-pointer rounded-lg border-0 px-3 py-1.5 text-[11px] font-medium transition ${
                                            filter === f.key
                                                ? "bg-emerald-50 text-[#0f6b55]"
                                                : "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-3 overflow-x-auto">
                                <table className="w-full min-w-[620px] text-left text-[11px]">
                                    <thead>
                                    <tr className="bg-gray-50 text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                                        <th className="rounded-l-lg px-4 py-2.5">Order ID</th>
                                        <th className="px-4 py-2.5">Customer ID</th>
                                        <th className="px-4 py-2.5">Total</th>
                                        <th className="px-4 py-2.5">Status</th>
                                        <th className="w-32 whitespace-nowrap rounded-r-lg px-4 py-2.5">Details</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {visible.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                                                No orders match this filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        visible.map((order) => {
                                            const status = normalize(order.status);
                                            const style = STATUS_STYLE[status] ?? FALLBACK_STYLE;

                                            return (
                                                <tr key={order.id} className="border-b border-gray-50 last:border-0">
                                                    <td className="px-4 py-4 font-semibold text-gray-900">
                                                        #{order.id}
                                                    </td>

                                                    <td className="px-4 py-4 text-gray-500">
                                                        {customerCode(order.customerId)}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <p className="font-semibold text-gray-900">
                                                            {money(Number(order.totalUsd))}
                                                        </p>
                                                        {order.totalLbp != null && (
                                                            <p className="mt-0.5 text-[10px] text-gray-400">
                                                                {Number(order.totalLbp).toLocaleString()} LBP
                                                            </p>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${style.box}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                {label(status)}
                            </span>
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-4">
                                                        <Link
                                                            href={`/orders/${order.id}`}
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: 6,
                                                                height: 32,
                                                                minWidth: 68,
                                                                padding: "0 14px",
                                                                textDecoration: "none",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                            className="rounded-full border border-solid border-gray-200 bg-white text-[11px] font-semibold leading-none text-gray-800 transition hover:border-[#0f6b55] hover:bg-[#0f6b55] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                                                        >
                                                            View
                                                            <svg
                                                                className="shrink-0"
                                                                width="11"
                                                                height="11"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2.4"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M5 12h14M13 6l6 6-6 6" />
                                                            </svg>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}