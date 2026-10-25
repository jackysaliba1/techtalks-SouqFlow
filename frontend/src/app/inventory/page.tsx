"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/services/productService";
import type { Product } from "@/types/product";

type Status = "in" | "low" | "out";

type Row = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  threshold: number;
  status: Status;
};

function toRow(p: Product): Row {
  const quantity = Number(p.quantity ?? 0);
  const threshold = Number(p.lowStockThreshold ?? 0);
  const status: Status = quantity <= 0 ? "out" : quantity <= threshold ? "low" : "in";

  return {
    id: p.id,
    name: p.name,
    price: Number(p.priceUsd ?? 0),
    quantity,
    threshold,
    status,
  };
}

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

type Filter = "all" | Status;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in", label: "In stock" },
  { key: "low", label: "Low stock" },
  { key: "out", label: "Out of stock" },
];

const BADGE: Record<Status, { label: string; box: string; dot: string }> = {
  in: { label: "In stock", box: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  low: { label: "Low stock", box: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
  out: { label: "Out of stock", box: "bg-red-50 text-red-600", dot: "bg-red-500" },
};

function barColor(r: Row) {
  if (r.status === "in") return "bg-emerald-500";
  if (r.status === "out") return "bg-gray-300";
  // low stock: red when very low, amber otherwise
  return r.quantity <= Math.max(r.threshold / 2, 1) ? "bg-red-400" : "bg-amber-400";
}

/* ------------------------------ page -------------------------------- */
export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    async function load() {
      try {
        setProducts(await getProducts());
      } catch (err) {
        console.error("Failed to load inventory:", err);
        setError("Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const rows = useMemo(() => products.map(toRow), [products]);

  const counts = useMemo(
    () => ({
      in: rows.filter((r) => r.status === "in").length,
      low: rows.filter((r) => r.status === "low").length,
      out: rows.filter((r) => r.status === "out").length,
    }),
    [rows]
  );

  const maxQty = Math.max(...rows.map((r) => r.quantity), 1);
  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen bg-[#f6f8f7]">
      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* ---------- Heading ---------- */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">Stock</p>
        <h1 className="mt-1 text-4xl font-bold text-[#0b2a22]">Inventory</h1>
        <p className="mt-1 text-xs text-gray-500">See what&apos;s on the shelf and what needs restocking.</p>

        {loading ? (
          <p className="mt-8 text-sm text-gray-500">Loading inventory...</p>
        ) : error ? (
          <p className="mt-8 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</p>
        ) : (
          <>
            {/* ---------- Summary cards ---------- */}
            <section className="mt-6 grid gap-4 sm:grid-cols-3">
              <SummaryCard value={counts.in} label="In stock" iconBox="bg-emerald-50 text-emerald-700" icon="✓" />
              <SummaryCard value={counts.low} label="Low stock" iconBox="bg-amber-50 text-amber-600" icon="!" />
              <SummaryCard value={counts.out} label="Out of stock" iconBox="bg-red-50 text-red-500" icon="×" />
            </section>

            {/* ---------- Table card ---------- */}
            <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap gap-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition ${
                      filter === f.key
                        ? "bg-emerald-50 text-[#0f6b55]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {rows.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm font-semibold text-gray-800">No products yet</p>
                  <p className="mt-1 text-xs text-gray-500">Add your first product and it will show up here.</p>
                  <Link
                    href="/products/add"
                    className="mt-4 inline-block rounded-lg bg-[#0f6b55] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0b4a3b]"
                  >
                    + Add product
                  </Link>
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-[11px]">
                    <thead>
                      <tr className="bg-gray-50 text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                        <th className="rounded-l-lg px-4 py-2.5">Product</th>
                        <th className="px-4 py-2.5">Price</th>
                        <th className="px-4 py-2.5">Stock</th>
                        <th className="rounded-r-lg px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                            No products match this filter.
                          </td>
                        </tr>
                      ) : (
                        visible.map((r) => {
                          const badge = BADGE[r.status];
                          const width = r.quantity <= 0 ? 0 : Math.max((r.quantity / maxQty) * 100, 4);
                          return (
                            <tr key={r.id} className="border-b border-gray-50 last:border-0">
                              <td className="px-4 py-4 font-semibold text-gray-900">{r.name}</td>
                              <td className="px-4 py-4 font-medium text-gray-800">{money(r.price)}</td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <span className="w-8 font-semibold text-gray-900">{r.quantity}</span>
                                  <div className="h-1 w-28 rounded-full bg-gray-100">
                                    <div className={`h-1 rounded-full ${barColor(r)}`} style={{ width: `${width}%` }} />
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${badge.box}`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                                  {badge.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function SummaryCard({
  value,
  label,
  icon,
  iconBox,
}: {
  value: number;
  label: string;
  icon: string;
  iconBox: string;
  }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <span className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-bold ${iconBox}`}>{icon}</span>
      <div>
        <p className="text-2xl font-bold leading-none text-[#0b2a22]">{value}</p>
        <p className="mt-1 text-[10px] text-gray-500">{label}</p>
      </div>
    </div>
  );
}