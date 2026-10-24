"use client";

import Link from "next/link";
import { useState, type CSSProperties, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/productService";

// TODO: the backend requires merchantId. Ideally the server reads it from the
// logged-in user's token. Until then, set the value your merchant row has.
const MERCHANT_ID = 1;

// Inline styles on purpose, so global CSS can't override them.
const input: CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  height: 46,
  padding: "0 14px",
  fontSize: 14,
  fontFamily: "inherit",
  color: "#173B32",
  background: "#fff",
  border: "1px solid #DDE6E0",
  borderRadius: 12,
  outline: "none",
};

const label: CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 12,
  fontWeight: 600,
  color: "#365449",
};

const hint: CSSProperties = { margin: "6px 0 0", fontSize: 11, color: "#9AA69F" };

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [priceLbp, setPriceLbp] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Product name is required.");
    if (priceUsd === "" || Number(priceUsd) < 0)
      return setError("Enter a valid USD price.");
    if (priceLbp === "" || Number(priceLbp) < 0)
      return setError("Enter a valid LBP price.");
    if (quantity === "" || Number(quantity) < 0)
      return setError("Enter a valid quantity.");
    if (lowStockThreshold === "" || Number(lowStockThreshold) < 0)
      return setError("Enter a valid low stock threshold.");

    setSaving(true);
    try {
      await createProduct({
        merchantId: MERCHANT_ID,
        name: name.trim(),
        description: description.trim() || undefined,
        sku: sku.trim() || undefined,
        priceUsd: Number(priceUsd),
        priceLbp: Number(priceLbp),
        quantity: Number(quantity),
        lowStockThreshold: Number(lowStockThreshold),
      });
      router.push("/products");
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Could not save the product."
      );
      setSaving(false);
    }
  }

  return (
    <main
      style={{ minHeight: "100vh", background: "#F7F9F7", padding: "32px 20px" }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link
          href="/products"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 34,
            padding: "0 14px",
            fontSize: 12,
            fontWeight: 600,
            color: "#173B32",
            textDecoration: "none",
            background: "#fff",
            border: "1px solid #E2E9E4",
            borderRadius: 10,
          }}
        >
          ← Back to Products
        </Link>

        <div style={{ marginTop: 22 }}>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#43836C",
            }}
          >
            Catalog
          </p>
          <h1 style={{ margin: "6px 0 0", fontSize: 34, fontWeight: 700, color: "#173B32" }}>
            Add product
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#7A8982" }}>
            Fill in the details below to add a new product to your catalog.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: 24,
            padding: 28,
            background: "#fff",
            border: "1px solid #E2E9E4",
            borderRadius: 16,
            boxShadow: "0 3px 14px rgba(23,59,50,0.035)",
          }}
        >
          <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            <div>
              <label style={label} htmlFor="name">Product name *</label>
              <input id="name" style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Olive oil 1L" />
            </div>

            <div>
              <label style={label} htmlFor="sku">SKU</label>
              <input id="sku" style={input} value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Optional" />
            </div>

            <div>
              <label style={label} htmlFor="priceUsd">Price (USD) *</label>
              <input id="priceUsd" type="number" min="0" step="0.01" style={input} value={priceUsd} onChange={(e) => setPriceUsd(e.target.value)} placeholder="0.00" />
            </div>

            <div>
              <label style={label} htmlFor="priceLbp">Price (LBP) *</label>
              <input id="priceLbp" type="number" min="0" step="1" style={input} value={priceLbp} onChange={(e) => setPriceLbp(e.target.value)} placeholder="0" />
            </div>

            <div>
              <label style={label} htmlFor="quantity">Quantity in stock *</label>
              <input id="quantity" type="number" min="0" step="1" style={input} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
            </div>

            <div>
              <label style={label} htmlFor="threshold">Low stock threshold *</label>
              <input id="threshold" type="number" min="0" step="1" style={input} value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} />
              <p style={hint}>You&apos;ll see &quot;Low Stock&quot; at or below this number.</p>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={label} htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional"
              style={{ ...input, height: "auto", padding: "12px 14px", resize: "vertical" }}
            />
          </div>

          {error && (
            <p
              style={{
                margin: "18px 0 0",
                padding: "10px 12px",
                fontSize: 13,
                color: "#b42318",
                background: "#fef3f2",
                border: "1px solid #fecdca",
                borderRadius: 10,
              }}
            >
              {error}
            </p>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Link
              href="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 44,
                padding: "0 20px",
                fontSize: 13,
                fontWeight: 600,
                color: "#173B32",
                textDecoration: "none",
                background: "#fff",
                border: "1px solid #DDE6E0",
                borderRadius: 12,
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              style={{
                height: 44,
                padding: "0 24px",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                color: "#fff",
                background: "#174E40",
                border: "none",
                borderRadius: 12,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Saving..." : "Save product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}