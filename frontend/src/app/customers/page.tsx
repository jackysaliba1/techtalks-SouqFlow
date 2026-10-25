"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCustomers, deleteCustomer } from "@/services/customerService";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Customer } from "@/types/customer";

type Row = {
  id: number;
  name: string;
  code: string;
  email: string;
  phone: string;
};

function toRow(c: Customer): Row {
  return {
    id: c.id,
    name: c.name || "Unnamed customer",
    code: `CUS-${String(c.id).padStart(3, "0")}`,
    email: c.email || "—",
    phone: c.phone || "—",
  };
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/* ------------------------------ page -------------------------------- */
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // delete flow
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setCustomers(await getCustomers());
      } catch (err) {
        console.error("Failed to load customers:", err);
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const rows = customers.map(toRow);

  function closeDialog() {
    if (deleting) return;
    setToDelete(null);
    setDeleteError("");
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteCustomer(toDelete.id);
      setCustomers((prev) => prev.filter((c) => c.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      console.error("Failed to delete customer:", err);
      // A customer that already has orders is usually rejected by the database
      setDeleteError(
        "Could not delete this customer. They may have orders linked to them."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f6f4]">
      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* ---------- Heading ---------- */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0f8466]">People</p>
            <h1 className="mt-1 text-4xl font-bold text-[#0b2a22]">Customers</h1>
            <p className="mt-1 text-xs text-gray-500">Keep every client&apos;s details in one place.</p>
          </div>

          <Link
            href="/customers/add"
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
            Add Customer
          </Link>
        </div>

        {/* ---------- Table card ---------- */}
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          {loading ? (
            <p className="px-3 py-10 text-center text-sm text-gray-500">Loading customers...</p>
          ) : error ? (
            <p className="m-2 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</p>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-semibold text-gray-800">No customers yet</p>
              <p className="mt-1 text-xs text-gray-500">Add your first customer and they will show up here.</p>
              <Link
                href="/customers/add"
                style={{ display: "inline-block", textDecoration: "none" }}
                className="mt-4 rounded-lg bg-[#0f6b55] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0b4a3b]"
              >
                + Add customer
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-[11px]">
                <thead>
                  <tr className="bg-gray-50 text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                    <th className="rounded-l-lg px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Phone</th>
                    <th className="whitespace-nowrap rounded-r-lg px-4 py-2.5" style={{ width: 190 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-[10px] font-bold text-[#0f6b55]">
                            {initials(r.name)}
                          </span>
                          <div className="leading-tight">
                            <p className="font-semibold text-gray-900">{r.name}</p>
                            <p className="text-[10px] text-gray-400">{r.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{r.email}</td>
                      <td className="px-4 py-4 text-amber-700/80">{r.phone}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Link
                            href={`/customers/${r.id}/edit`}
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
                            className="rounded-full border border-solid border-emerald-200 bg-emerald-50 text-[11px] font-semibold leading-none text-[#0f6b55] transition hover:border-[#0f6b55] hover:bg-[#0f6b55] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          >
                            <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => setToDelete(r)}
                            aria-label={`Delete ${r.name}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                              height: 32,
                              minWidth: 76,
                              padding: "0 14px",
                              fontFamily: "inherit",
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                            }}
                            className="rounded-full border border-solid border-red-200 bg-red-50 text-[11px] font-semibold leading-none text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                          >
                            <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete customer?"
        message={
          toDelete
            ? `${toDelete.name} will be removed permanently. This can't be undone.`
            : ""
        }
        confirmLabel="Delete customer"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={closeDialog}
      />
    </div>
  );
}