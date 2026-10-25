"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { useParams } from "next/navigation";

import { getOrderById, updateOrderStatus } from "@/services/orderService";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Order } from "@/types/order";

/* All styling is inline on purpose: nothing for global CSS to override. */
const FONT = "inherit";

const s: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: "#f3f6f4" },
  container: {
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 760,
    margin: "0 auto",
    padding: "28px 24px 40px",
  },
  message: { fontSize: 13, color: "#6b7c76" },
  error: {
    marginTop: 20,
    padding: "12px 14px",
    fontSize: 13,
    color: "#b42318",
    background: "#fef3f2",
    border: "1px solid #fecdca",
    borderRadius: 10,
  },
  back: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    height: 32,
    boxSizing: "border-box",
    padding: "0 14px",
    fontSize: 11,
    fontWeight: 600,
    color: "#0b2a22",
    textDecoration: "none",
    whiteSpace: "nowrap",
    background: "#fff",
    border: "1px solid #e1e8e5",
    borderRadius: 10,
    boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 22,
  },
  eyebrow: {
    margin: 0,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#0f8466",
  },
  title: { margin: "4px 0 0", fontSize: 34, lineHeight: 1.1, fontWeight: 700, color: "#0b2a22" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 16,
    marginTop: 18,
    alignItems: "start",
  },
  card: {
    boxSizing: "border-box",
    padding: "22px 24px",
    background: "#fff",
    border: "1px solid #edf1ef",
    borderRadius: 16,
    boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
  },
  cardTitle: { margin: "0 0 12px", fontSize: 18, fontWeight: 700, color: "#0b2a22" },
  rows: { margin: 0, padding: 0, listStyle: "none" },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "13px 0",
  },
  rowLabel: { fontSize: 11, color: "#8a6a4a" },
  rowValue: { fontSize: 11, fontWeight: 700, color: "#0b2a22", textAlign: "right" },
  total: {
    boxSizing: "border-box",
    padding: "22px 24px",
    color: "#fff",
    background: "linear-gradient(160deg, #0f6b55 0%, #0b4a3b 55%, #08382d 100%)",
    borderRadius: 16,
    boxShadow: "0 14px 28px rgba(8,56,45,0.18)",
  },
  totalTitle: { margin: "0 0 14px", fontSize: 18, fontWeight: 700, color: "#fff" },
  currencyLabel: {
    margin: 0,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#5fe0b7",
  },
  usd: { margin: "4px 0 0", fontSize: 40, lineHeight: 1.1, fontWeight: 700, color: "#fff" },
  divider: { height: 1, margin: "16px 0 14px", background: "rgba(255,255,255,0.14)" },
  lbp: { margin: "4px 0 0", fontSize: 26, lineHeight: 1.15, fontWeight: 700, color: "#fff" },
  lbpUnit: { marginLeft: 4, fontSize: 12, fontWeight: 600, color: "#b9e8d8" },
  rate: { margin: "10px 0 0", fontSize: 9, color: "#b9e8d8" },
};

const pillBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 10px",
  fontSize: 10,
  fontWeight: 600,
  whiteSpace: "nowrap",
  borderRadius: 999,
  fontFamily: FONT,
};

const PILL: Record<string, { color: string; bg: string; dot: string }> = {
  paid: { color: "#047857", bg: "#e7f7f0", dot: "#10b981" },
  pending: { color: "#b45309", bg: "#fdf1dc", dot: "#f5a524" },
  cancelled: { color: "#dc2626", bg: "#fdecec", dot: "#ef4444" },
};
const PILL_OTHER = { color: "#4b5563", bg: "#f1f3f2", dot: "#9ca3af" };

// "PAID", "paid", "Paid" -> "paid"
const normalize = (v: string | undefined) => String(v ?? "").trim().toLowerCase();
const capitalize = (v: string) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : "—");
const customerCode = (id: number) => `CUS-${String(id).padStart(3, "0")}`;
const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

function formatDate(value: string | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function StatusPill({ status }: { status: string | undefined }) {
  const key = normalize(status);
  const c = PILL[key] ?? PILL_OTHER;
  return (
    <span style={{ ...pillBase, color: c.color, background: c.bg }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
      {capitalize(key)}
    </span>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // status change flow
  const [pendingAction, setPendingAction] = useState<null | "PAID" | "CANCELLED">(null);
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState("");

  async function confirmStatusChange() {
    if (!pendingAction || !order) return;
    setUpdating(true);
    setActionError("");
    try {
      const updated = await updateOrderStatus(order.id, pendingAction);
      setOrder({ ...order, status: updated.status });
      setPendingAction(null);
    } catch (err) {
      console.warn("Failed to update order status:", err);
      setActionError(
        err instanceof Error && err.message
          ? err.message
          : "Could not update the order."
      );
    } finally {
      setUpdating(false);
    }
  }

  function closeDialog() {
    if (updating) return;
    setPendingAction(null);
    setActionError("");
  }

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

  const backLink = (
    <Link href="/orders" style={s.back}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </svg>
      Back to Orders
    </Link>
  );

  if (loading) {
    return (
      <div style={s.page}>
        <main style={s.container}>
          <p style={s.message}>Loading order...</p>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={s.page}>
        <main style={s.container}>
          {backLink}
          <p style={s.error}>{error || "Order not found."}</p>
        </main>
      </div>
    );
  }

  const totalUsd = Number(order.totalUsd);
  const totalLbp = order.totalLbp != null ? Number(order.totalLbp) : null;

  // Rate used is derived from the saved totals (LBP / USD)
  const rate = totalLbp !== null && totalUsd > 0 ? Math.round(totalLbp / totalUsd) : null;

  const createdAt = (order as Order & { createdAt?: string }).createdAt;

  const info: { label: string; value: React.ReactNode }[] = [
    { label: "Order ID", value: `#${order.id}` },
    { label: "Customer ID", value: customerCode(order.customerId) },
    { label: "Date", value: formatDate(createdAt) },
    { label: "Status", value: <StatusPill status={order.status} /> },
  ];

  return (
    <div style={s.page}>
      <main style={s.container}>
        {backLink}

        {/* ---------- Header ---------- */}
        <div style={s.header}>
          <div>
            <p style={s.eyebrow}>Order details</p>
            <h1 style={s.title}>Order #{order.id}</h1>
          </div>
          <StatusPill status={order.status} />
        </div>

        <div style={s.grid}>
          {/* ---------- Order information ---------- */}
          <section style={s.card}>
            <h2 style={s.cardTitle}>Order information</h2>

            <ul style={s.rows}>
              {info.map((item, i) => (
                <li
                  key={item.label}
                  style={{
                    ...s.row,
                    borderBottom: i === info.length - 1 ? "none" : "1px solid #f1f4f2",
                  }}
                >
                  <span style={s.rowLabel}>{item.label}</span>
                  <span style={s.rowValue}>{item.value}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------- Order total ---------- */}
          <section style={s.total}>
            <h2 style={s.totalTitle}>Order total</h2>

            <p style={s.currencyLabel}>US Dollars</p>
            <p style={s.usd}>{usd(totalUsd)}</p>

            <div style={s.divider} />

            <p style={s.currencyLabel}>Lebanese Pounds</p>
            <p style={s.lbp}>
              {totalLbp !== null ? totalLbp.toLocaleString("en-US") : "—"}
              {totalLbp !== null && <span style={s.lbpUnit}>LBP</span>}
            </p>

            {rate !== null && (
              <p style={s.rate}>Rate used: 1 USD = {rate.toLocaleString("en-US")} LBP</p>
            )}
          </section>
        </div>

        {/* ---------- Status actions (only while pending) ---------- */}
        {normalize(order.status) === "pending" && (
          <section style={{ ...s.card, marginTop: 16 }}>
            <h2 style={s.cardTitle}>Update status</h2>
            <p style={{ margin: "4px 0 14px", fontSize: 11, color: "#6b7c76" }}>
              Mark this order as paid once the customer pays, or cancel it.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button
                type="button"
                onClick={() => setPendingAction("PAID")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                  padding: "0 20px",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  color: "#fff",
                  background: "linear-gradient(90deg, #0f6b55 0%, #0a3328 100%)",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Mark as paid
              </button>
              <button
                type="button"
                onClick={() => setPendingAction("CANCELLED")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                  padding: "0 20px",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  color: "#dc2626",
                  background: "#fdecec",
                  border: "1px solid #fecdca",
                  borderRadius: 10,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Cancel order
              </button>
            </div>
          </section>
        )}
      </main>

      <ConfirmDialog
        open={pendingAction !== null}
        title={pendingAction === "PAID" ? "Mark order as paid?" : "Cancel this order?"}
        message={
          pendingAction === "PAID"
            ? `Order #${order.id} will be marked as paid. This can't be undone.`
            : `Order #${order.id} will be cancelled. This can't be undone.`
        }
        confirmLabel={pendingAction === "PAID" ? "Mark as paid" : "Cancel order"}
        loading={updating}
        error={actionError}
        onConfirm={confirmStatusChange}
        onCancel={closeDialog}
      />
    </div>
  );
}