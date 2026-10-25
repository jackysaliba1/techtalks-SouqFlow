"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";

import type { CreateCustomerRequest } from "@/types/customer";
import { getCustomerById, updateCustomer } from "@/services/customerService";

// Inline styles on purpose, so global CSS can't override them.
const s: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: "#f3f6f4" },
  container: {
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 560,
    margin: "0 auto",
    padding: "28px 24px 40px",
  },
  back: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    fontWeight: 600,
    color: "#0f6b55",
    textDecoration: "none",
  },
  eyebrow: {
    margin: "18px 0 0",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#0f8466",
  },
  title: { margin: "4px 0 0", fontSize: 34, lineHeight: 1.1, fontWeight: 700, color: "#0b2a22" },
  subtitle: { margin: "6px 0 0", fontSize: 12, color: "#6b7c76" },
  card: {
    boxSizing: "border-box",
    marginTop: 20,
    padding: 24,
    background: "#fff",
    border: "1px solid #edf1ef",
    borderRadius: 16,
    boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
  },
  identity: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    paddingBottom: 18,
    marginBottom: 18,
    borderBottom: "1px solid #f1f4f2",
  },
  avatar: {
    display: "grid",
    placeItems: "center",
    width: 44,
    height: 44,
    flexShrink: 0,
    fontSize: 13,
    fontWeight: 700,
    color: "#0f6b55",
    background: "#e7f7f0",
    borderRadius: "50%",
  },
  idName: { margin: 0, fontSize: 13, fontWeight: 700, color: "#0b2a22" },
  idCode: { margin: "2px 0 0", fontSize: 10, color: "#8a9a94" },
  field: { marginBottom: 16 },
  label: { display: "block", marginBottom: 6, fontSize: 10, fontWeight: 600, color: "#0b2a22" },
  input: {
    boxSizing: "border-box",
    width: "100%",
    height: 42,
    padding: "0 14px",
    fontSize: 12,
    fontFamily: "inherit",
    color: "#0b2a22",
    background: "#fff",
    border: "1px solid #e1e8e5",
    borderRadius: 10,
    outline: "none",
  },
  error: {
    margin: "0 0 16px",
    padding: "10px 12px",
    fontSize: 12,
    color: "#b42318",
    background: "#fef3f2",
    border: "1px solid #fecdca",
    borderRadius: 10,
  },
  actions: { display: "flex", alignItems: "center", gap: 10, marginTop: 8 },
  save: {
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
    boxShadow: "0 6px 14px rgba(8,56,45,0.2)",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  cancel: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    padding: "0 20px",
    fontSize: 12,
    fontWeight: 600,
    color: "#0b2a22",
    textDecoration: "none",
    background: "#fff",
    border: "1px solid #e1e8e5",
    borderRadius: 10,
    whiteSpace: "nowrap",
  },
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [form, setForm] = useState<CreateCustomerRequest>({
    name: "",
    email: "",
    phone: "",
  });
  const [savedName, setSavedName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const code = `CUS-${String(id).padStart(3, "0")}`;

  useEffect(() => {
    getCustomerById(id)
      .then((customer) => {
        setForm({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        });
        setSavedName(customer.name);
      })
      .catch((err) => {
        console.warn("Failed to load customer:", err);
        setError("Failed to load customer.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) return setError("Name is required.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email.");
    if (!form.phone.trim()) return setError("Phone is required.");

    try {
      setSaving(true);
      setError("");
      await updateCustomer(id, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      router.push("/customers");
    } catch (err) {
      console.warn("Failed to update customer:", err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Failed to update customer."
      );
      setSaving(false);
    }
  };

  const back = (
    <Link href="/customers" style={s.back}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </svg>
      Back to Customers
    </Link>
  );

  if (loading) {
    return (
      <div style={s.page}>
        <main style={s.container}>
          <p style={s.subtitle}>Loading customer...</p>
        </main>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <main style={s.container}>
        {back}

        <p style={s.eyebrow}>Customer {code}</p>
        <h1 style={s.title}>Edit customer</h1>
        <p style={s.subtitle}>Update their details and save your changes.</p>

        <form style={s.card} onSubmit={handleSubmit} noValidate>
          <div style={s.identity}>
            <div style={s.avatar}>{initials(savedName || form.name)}</div>
            <div>
              <p style={s.idName}>{savedName || "Customer"}</p>
              <p style={s.idCode}>Customer ID {code}</p>
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label} htmlFor="name">Name</label>
            <input id="name" name="name" type="text" style={s.input} value={form.name} onChange={handleChange} />
          </div>

          <div style={s.field}>
            <label style={s.label} htmlFor="email">Email</label>
            <input id="email" name="email" type="email" style={s.input} value={form.email} onChange={handleChange} />
          </div>

          <div style={s.field}>
            <label style={s.label} htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="text" style={s.input} value={form.phone} onChange={handleChange} />
          </div>

          {error && <p style={s.error}>{error}</p>}

          <div style={s.actions}>
            <button
              type="submit"
              disabled={saving}
              style={{ ...s.save, opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            <Link href="/customers" style={s.cancel}>
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}