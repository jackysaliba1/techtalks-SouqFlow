"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createOrder } from "@/services/orderService";
import type { CreateOrderRequest } from "@/types/order";

export default function CreateOrderPage() {
    const router = useRouter();

    const [form, setForm] = useState<CreateOrderRequest>({
        customerId: 1,
        totalAmount: 0,
        status: "PENDING",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await createOrder(form);

            router.push("/orders");
        } catch (err) {
            console.error(err);
            setError("Failed to create order.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-3xl font-bold text-gray-900">
                    Create Order
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-xl bg-white p-6 shadow"
                >
                    <div>
                        <label className="mb-2 block font-medium text-gray-700">
                            Customer ID
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={form.customerId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    customerId: Number(e.target.value),
                                })
                            }
                            className="w-full rounded-lg border px-4 py-3 text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium text-gray-700">
                            Total Amount (USD)
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.totalAmount}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    totalAmount: Number(e.target.value),
                                })
                            }
                            className="w-full rounded-lg border px-4 py-3 text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium text-gray-700">
                            Status
                        </label>

                        <select
                            value={form.status}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    status: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border px-4 py-3 text-gray-900"
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>

                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Order"}
                    </button>
                </form>
            </div>
        </main>
    );
}