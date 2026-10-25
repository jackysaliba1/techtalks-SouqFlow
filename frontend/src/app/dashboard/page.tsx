"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/services/productService";
import { getOrders } from "@/services/orderService";
import { getDashboard } from "@/services/dashboardService";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";
import type { Dashboard } from "@/services/dashboardService";
type OrderView = {
  id: string | number;
  customer: string;
  total: number;
  status: string; // lowercase: paid | pending | cancelled ...
  date: Date | null; // null when the backend doesn't send an order date
  items: { name: string; qty: number }[];
};

function toOrderView(o: Order, productNames: Map<number, string>): OrderView {// createdAt isn't in your Order type yet; add `createdAt?: string` to it
  const rawDate = (o as Order & { createdAt?: string }).createdAt;
  const ids = o.productIds ?? [];
  const qtys = o.quantities ?? [];

  return {
    id: o.id,
    customer: `Customer #${o.customerId}`, // swap for a real name once you load customers
    total: Number(o.totalUsd ?? 0),
    status: String(o.status ?? "").toLowerCase(),
    date: rawDate ? new Date(rawDate) : null,
    items: ids.map((pid, i) => ({
      name: productNames.get(pid) ?? `Product #${pid}`,
      qty: Number(qtys[i] ?? 1),
    })),
  };
}

/* ------------------------------ helpers ----------------------------- */
const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

function sumBetween(orders: OrderView[], from: Date, to: Date) {
  return orders
    .filter((o) => o.status !== "cancelled" && o.date !== null && o.date >= from && o.date < to)
    .reduce((s, o) => s + o.total, 0);
}

function countBetween(orders: OrderView[], from: Date, to: Date) {
  return orders.filter((o) => o.date !== null && o.date >= from && o.date < to).length;
}

function pct(cur: number, prev: number): number | null {
  if (prev === 0) return null;
  return ((cur - prev) / prev) * 100;
}

function niceMax(max: number) {
  if (max <= 0) return 100;
  const mag = 10 ** Math.floor(Math.log10(max));
  const n = max / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag;
}

type Range = "7d" | "30d" | "year";

function buildSeries(orders: OrderView[], range: Range) {
  const today = startOfDay(new Date());
  const out: { label: string; value: number }[] = [];

  if (range === "year") {
    for (let i = 11; i >= 0; i--) {
      const from = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const to = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
      out.push({ label: from.toLocaleString("en-US", { month: "short" }), value: sumBetween(orders, from, to) });
    }
    return out;
  }

  const days = range === "7d" ? 7 : 30;
  for (let i = days - 1; i >= 0; i--) {
    const from = addDays(today, -i);
    const label =
      range === "7d"
        ? from.toLocaleString("en-US", { weekday: "short" })
        : i % 5 === 0 || i === days - 1
          ? String(from.getDate())
          : "";
    out.push({ label, value: sumBetween(orders, from, addDays(from, 1)) });
  }
  return out;
}

/* ----------------------------- small UI bits ------------------------ */
function Trend({ value, vs }: { value: number | null; vs: string }) {
  if (value === null) return <p className="mt-2 text-[10px] text-gray-400">No data {vs}</p>;
  const up = value >= 0;
  return (
    <p className="mt-2 text-[10px] text-gray-500">
      <span className={up ? "font-semibold text-emerald-600" : "font-semibold text-red-500"}>
        {up ? "↗" : "↘"} {Math.abs(value).toFixed(1)}%
      </span>{" "}
      {vs}
    </p>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconClass,
  children,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconClass: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-[11px] text-gray-500">{label}</p>
        <span className={`grid h-6 w-6 place-items-center rounded-md ${iconClass}`}>{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-[#0b2a22]">{value}</p>
      {children}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-600",
};

function SalesChart({ series }: { series: { label: string; value: number }[] }) {
  const W = 600, H = 210, padL = 44, padR = 12, padT = 28, padB = 26;
  const max = niceMax(Math.max(...series.map((s) => s.value), 0));
  const n = series.length;
  const x = (i: number) => padL + (n === 1 ? 0 : (i * (W - padL - padR)) / (n - 1));
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);

  const line = series.map((s, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(s.value)}`).join(" ");
  const area = `${line} L${x(n - 1)},${H - padB} L${x(0)},${H - padB} Z`;
  const peak = series.reduce((b, s, i) => (s.value > series[b].value ? i : b), 0);
  const ticks = [0, 1, 2, 3, 4].map((t) => (max / 4) * t);
  const tip = money(series[peak].value);
  const tipW = tip.length * 6 + 14;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#eef2f0" />
          <text x={padL - 8} y={y(t) + 3} textAnchor="end" fontSize="9" fill="#8a9a95">
            {t >= 1000 ? `$${(t / 1000).toFixed(t % 1000 ? 1 : 0)}k` : `$${Math.round(t)}`}
          </text>
        </g>
      ))}

      <path d={area} fill="url(#salesFill)" />
      <path d={line} fill="none" stroke="#0f8466" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {series.map((s, i) => (
        <g key={i}>
          {n <= 12 && <circle cx={x(i)} cy={y(s.value)} r={i === peak ? 4.5 : 3} fill={i === peak ? "#f5a524" : "#fff"} stroke={i === peak ? "#fff" : "#0f8466"} strokeWidth="2" />}
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#8a9a95">
            {s.label}
          </text>
        </g>
      ))}

      {series[peak].value > 0 && (
        <g>
          <rect x={x(peak) - tipW / 2} y={y(series[peak].value) - 26} width={tipW} height="18" rx="5" fill="#0b2a22" />
          <text x={x(peak)} y={y(series[peak].value) - 14} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
            {tip}
          </text>
        </g>
      )}
    </svg>
  );
}

/* -------------------------------- page ------------------------------ */
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState<Range>("7d");
  const [firstName, setFirstName] = useState("");

  // ---- your original data loading, unchanged ----


useEffect(() => {
  // Load the logged-in user's name
  const savedName = localStorage.getItem("userName");
  console.log("Saved user name:", savedName);

  if (savedName) {
    setFirstName(savedName.trim().split(" ")[0]);
  }

  async function loadDashboard() {
    try {
      const [productsData, ordersData, dashboardData] = await Promise.all([
        getProducts(),
        getOrders(),
        getDashboard(),
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setDashboard(dashboardData);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  loadDashboard();
}, []);


  // ---- derived data for the new design ----
  const productNames = useMemo(
    () => new Map<number, string>(products.map((p) => [Number(p.id), p.name])),
    [products]
  );
  const views = useMemo(
    () => orders.map((o) => toOrderView(o, productNames)),
    [orders, productNames]
  );
  const hasDates = views.some((o) => o.date !== null);
  const totalAll = views
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  const lowStockProducts = products.filter(
    (p) => p.quantity > 0 && p.quantity <= p.lowStockThreshold
  );
  const outOfStockProducts = products.filter((p) => p.quantity <= 0);
  const alertProducts = [...outOfStockProducts, ...lowStockProducts].slice(0, 4);

  const now = new Date();
  const today = startOfDay(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthName = prevMonthStart.toLocaleString("en-US", { month: "long" });
  const monthName = now.toLocaleString("en-US", { month: "long" });

  const revenue = hasDates ? sumBetween(views, monthStart, addDays(today, 1)) : totalAll;
  const prevRevenue = sumBetween(views, prevMonthStart, monthStart);
  const ordersThisMonth = hasDates ? countBetween(views, monthStart, addDays(today, 1)) : views.length;
  const ordersPrevMonth = countBetween(views, prevMonthStart, monthStart);

  const todaySales = sumBetween(views, today, addDays(today, 1));
  const yesterdaySales = sumBetween(views, addDays(today, -1), today);
  const week = sumBetween(views, addDays(today, -6), addDays(today, 1));
  const prevWeek = sumBetween(views, addDays(today, -13), addDays(today, -6));
  const weekChange = pct(week, prevWeek);

  const pendingCount = views.filter((o) => o.status === "pending").length;
  const recent = [...views]
    .sort(
      (a, b) =>
        (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0) || Number(b.id) - Number(a.id)
    )
    .slice(0, 5);

  const topProducts = useMemo(() => {
    const map = new Map<string, number>();
    views.filter((o) => o.status !== "cancelled").forEach((o) =>
      o.items.forEach((i) => map.set(i.name, (map.get(i.name) ?? 0) + i.qty))
    );
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [views]);

  const series = useMemo(() => buildSeries(views, range), [views, range]);
  const seriesTotal = series.reduce((s, p) => s + p.value, 0);

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateLabel = now
    .toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f6f8f7]">


      <main className="mx-auto max-w-6xl space-y-4 px-6 py-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        ) : error ? (
          <p className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</p>
        ) : dashboard ? (
          <>
            {/* ---------- Hero ---------- */}
            <section className="flex flex-col justify-between gap-6 rounded-3xl bg-gradient-to-br from-[#0f6b55] via-[#0b4a3b] to-[#08382d] p-8 text-white md:flex-row md:items-center">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.15em] text-emerald-300">{dateLabel}</p>
                <h1 className="mt-2 text-3xl font-bold">
                  {greeting}, {firstName || "there"}
                </h1>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-emerald-100/90">
                  {weekChange !== null && (
                    <>
                      Sales are {weekChange >= 0 ? "up" : "down"} on last week.{" "}
                    </>
                  )}
                  You have {dashboard.lowStockCount} products running low and {pendingCount} orders waiting to be
                  processed.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href="/orders/add" className="rounded-lg bg-emerald-400 px-4 py-2 text-xs font-semibold text-[#08382d] hover:bg-emerald-300">
                    + New order
                  </Link>
                  <Link href="/products/add" className="rounded-lg border border-white/25 bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10">
                    Add product
                  </Link>
                  <Link href="/customers/add" className="rounded-lg border border-white/25 bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10">
                    Add customer
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-5 md:min-w-[230px]">
                <p className="text-[10px] text-emerald-100/80">{hasDates ? "Today's sales" : "Total sales"}</p>
                <p className="mt-1 text-4xl font-bold">{money(hasDates ? todaySales : totalAll)}</p>
                {pct(todaySales, yesterdaySales) !== null && (
                  <p className="mt-1 text-[10px] font-semibold text-emerald-300">
                    ↗ {Math.abs(pct(todaySales, yesterdaySales)!).toFixed(0)}% vs yesterday
                  </p>
                )}
              </div>
            </section>

            {/* ---------- KPI cards ---------- */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label={hasDates ? `Revenue · ${monthName}` : "Revenue · All time"} value={money(revenue)} iconClass="bg-emerald-50 text-emerald-700" icon={<span className="text-[11px] font-bold">$</span>}>
                {hasDates && <Trend value={pct(revenue, prevRevenue)} vs={`vs ${prevMonthName}`} />}
              </StatCard>

              <StatCard label={hasDates ? `Orders · ${monthName}` : "Orders · All time"} value={ordersThisMonth} iconClass="bg-emerald-50 text-emerald-700" icon={<span className="text-[11px]">▤</span>}>
                {hasDates && <Trend value={pct(ordersThisMonth, ordersPrevMonth)} vs={`vs ${prevMonthName}`} />}
              </StatCard>

              <StatCard label="Units in stock" value={dashboard.totalStockUnits.toLocaleString()} iconClass="bg-emerald-50 text-emerald-700" icon={<span className="text-[11px]">◈</span>}>
                <p className="mt-2 text-[10px] text-gray-500">Across {dashboard.totalProducts} products</p>
              </StatCard>

              <StatCard label="Low stock" value={dashboard.lowStockCount} iconClass="bg-amber-50 text-amber-600" icon={<span className="text-[11px] font-bold">!</span>}>
                <Link href="/inventory" className="mt-2 inline-block text-[10px] font-semibold text-[#0f6b55] hover:underline">
                  Review items →
                </Link>
              </StatCard>
            </section>

            {/* ---------- Chart + low stock ---------- */}
            <section className="grid gap-4 lg:grid-cols-[1.75fr_1fr]">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-bold text-[#0b2a22]">Sales overview</h2>
                    <p className="text-[10px] text-gray-500">
                      Daily revenue · {range === "7d" ? "last 7 days" : range === "30d" ? "last 30 days" : "last 12 months"} · total {money(seriesTotal)}
                    </p>
                  </div>
                  <div className="flex rounded-lg border border-gray-100 p-0.5 text-[10px] font-medium">
                    {([["7d", "7 days"], ["30d", "30 days"], ["year", "Year"]] as [Range, string][]).map(([k, label]) => (
                      <button
                        key={k}
                        onClick={() => setRange(k)}
                        className={`rounded-md px-2.5 py-1 ${range === k ? "bg-emerald-50 text-[#0f6b55]" : "text-gray-500 hover:text-gray-800"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  {hasDates ? (
                    <SalesChart series={series} />
                  ) : (
                    <p className="grid h-48 place-items-center rounded-xl bg-gray-50 px-6 text-center text-xs text-gray-500">

                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#0b2a22]">Low stock</h2>
                  <Link href="/inventory" className="text-[10px] font-semibold text-[#0f6b55] hover:underline">
                    View all
                  </Link>
                </div>

                <div className="mt-4 flex-1 space-y-4">
                  {alertProducts.length === 0 ? (
                    <p className="text-xs text-gray-500">No stock alerts. All products have enough stock.</p>
                  ) : (
                    alertProducts.map((p) => {
                      const ratio = Math.max(0, Math.min(1, p.quantity / Math.max(p.lowStockThreshold, 1)));
                      const critical = ratio < 0.5;
                      return (
                        <div key={p.id}>
                          <div className="flex justify-between text-[11px]">
                            <span className="font-medium text-gray-800">{p.name}</span>
                            <span className={`font-semibold ${critical ? "text-red-500" : "text-amber-600"}`}>
                              {p.quantity <= 0 ? "Out" : `${p.quantity} left`}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1 rounded-full bg-gray-100">
                            <div
                              className={`h-1 rounded-full ${critical ? "bg-red-400" : "bg-amber-400"}`}
                              style={{ width: `${Math.max(ratio * 100, 4)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <Link
                  href="/inventory"
                  className="mt-5 block rounded-lg bg-emerald-50 py-2.5 text-center text-xs font-semibold text-[#0f6b55] hover:bg-emerald-100"
                >
                  Create restock order
                </Link>
              </div>
            </section>

            {/* ---------- Recent orders + top products ---------- */}
            <section className="grid gap-4 lg:grid-cols-[1.75fr_1fr]">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#0b2a22]">Recent orders</h2>
                  <Link href="/orders" className="text-[10px] font-semibold text-[#0f6b55] hover:underline">
                    View all orders
                  </Link>
                </div>

                <table className="mt-3 w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-gray-50 text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                      <th className="rounded-l-lg px-3 py-2">Order</th>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Total</th>
                      <th className="rounded-r-lg px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
                          No orders yet.
                        </td>
                      </tr>
                    ) : (
                      recent.map((o) => (
                        <tr key={o.id} className="border-b border-gray-50 last:border-0">
                          <td className="px-3 py-3 font-semibold text-gray-900">#{o.id}</td>
                          <td className="px-3 py-3 text-gray-600">{o.customer}</td>
                          <td className="px-3 py-3 font-semibold text-[#0f6b55]">{money(o.total)}</td>
                          <td className="px-3 py-3">
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyles[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                              {o.status || "—"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#0b2a22]">Top products</h2>
                  <span className="text-[10px] text-gray-400">All time</span>
                </div>

                <div className="mt-4 space-y-4">
                  {topProducts.length === 0 ? (
                    <p className="text-xs text-gray-500">No sales data yet.</p>
                  ) : (
                    topProducts.map(([name, qty], i) => (
                      <div key={name}>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="grid h-5 w-5 place-items-center rounded-md bg-emerald-50 text-[10px] font-bold text-[#0f6b55]">
                            {i + 1}
                          </span>
                          <span className="flex-1 font-medium text-gray-800">{name}</span>
                          <span className="font-semibold text-gray-600">{qty} sold</span>
                        </div>
                        <div className="ml-7 mt-1.5 h-1 rounded-full bg-gray-100">
                          <div className="h-1 rounded-full bg-[#0f8466]" style={{ width: `${(qty / topProducts[0][1]) * 100}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}