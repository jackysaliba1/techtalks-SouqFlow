"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/services/customerService";

type FieldErrors = { name?: string; email?: string; phone?: string };

const inputClass =
  "block w-full rounded-xl border border-solid border-gray-200 bg-white px-4 py-3 text-xs text-[#0b2a22] outline-none transition placeholder:text-gray-400 focus:border-[#0f8466] focus:ring-4 focus:ring-emerald-100";

export default function AddCustomerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "Enter a valid email";
    if (phone.trim().length < 6) e.phone = "Enter a valid phone number";
    return e;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setFormError("");

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);
    try {
      await createCustomer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      router.push("/customers");
    } catch (err) {
      console.error("Failed to create customer:", err);
      setFormError("Could not save the customer. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f6f4]">
      <main className="mx-auto max-w-xl px-6 py-8">
        {/* ---------- Back link ---------- */}
        <Link
          href="/customers"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}
          className="text-[11px] font-semibold text-[#0f6b55] hover:text-[#0b4a3b]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Back to Customers
        </Link>

        {/* ---------- Heading ---------- */}
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0f8466]">New customer</p>
        <h1 className="mt-1 text-4xl font-bold text-[#0b2a22]">Add a customer</h1>
        <p className="mt-1 text-xs text-gray-500">Save their contact details so you can link them to orders.</p>

        {/* ---------- Form card ---------- */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          {formError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {formError}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-[11px] font-semibold text-[#0b2a22]">
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Customer's full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${inputClass} ${errors.name ? "!border-red-400" : ""}`}
              />
              {errors.name && <p className="mt-1.5 text-[10px] text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[11px] font-semibold text-[#0b2a22]">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} ${errors.email ? "!border-red-400" : ""}`}
              />
              {errors.email && <p className="mt-1.5 text-[10px] text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-[11px] font-semibold text-[#0b2a22]">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+961 70 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${inputClass} ${errors.phone ? "!border-red-400" : ""}`}
              />
              {errors.phone && <p className="mt-1.5 text-[10px] text-red-500">{errors.phone}</p>}
            </div>
          </div>

          {/* ---------- Actions ---------- */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 42,
                padding: "0 22px",
                backgroundImage: "linear-gradient(90deg, #0f6b55 0%, #0a3328 100%)",
              }}
              className="cursor-pointer whitespace-nowrap rounded-xl border-0 bg-[#0f6b55] text-xs font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {saving ? "Saving..." : "Save customer"}
            </button>

            <Link
              href="/customers"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 42,
                padding: "0 22px",
                textDecoration: "none",
              }}
              className="whitespace-nowrap rounded-xl border border-solid border-gray-200 bg-white text-xs font-semibold text-[#0b2a22] transition hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}