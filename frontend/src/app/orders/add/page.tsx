"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createOrder } from "@/services/orderService";
import { getCustomers } from "@/services/customerService";
import { getProducts } from "@/services/productService";

import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";

import styles from "./order.module.css";

export default function CreateOrderPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // 0 = nothing selected yet (shows the "Select ..." placeholder)
  const [customerId, setCustomerId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ---- your original data loading (without auto-selecting the first item) ----
  useEffect(() => {
    async function loadData() {
      try {
        const [customerData, productData] = await Promise.all([
          getCustomers(),
          getProducts(),
        ]);

        setCustomers(customerData);
        setProducts(productData);
      } catch (err) {
        console.error(err);
        setError("Failed to load customers or products.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const selectedProduct = products.find((product) => product.id === productId);

  const estimatedTotal = selectedProduct
    ? Number(selectedProduct.priceUsd) * quantity
    : 0;

  const overStock =
    selectedProduct !== undefined && quantity > Number(selectedProduct.quantity);

  const canSubmit =
    !saving &&
    customerId !== 0 &&
    productId !== 0 &&
    Number.isInteger(quantity) &&
    quantity >= 1;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (customerId === 0) return setError("Please select a customer.");
    if (productId === 0) return setError("Please select a product.");
    if (!Number.isInteger(quantity) || quantity < 1)
      return setError("Quantity must be at least 1.");

    try {
      setSaving(true);
      setError("");

      await createOrder({
        customerId,
        productIds: [productId],
        quantities: [quantity],
      });

      router.push("/orders");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Failed to create order. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        {/* ---------- Back link ---------- */}
        <Link href="/orders" className={styles.back}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Back to Orders
        </Link>

        {/* ---------- Heading ---------- */}
        <p className={styles.eyebrow}>New order</p>
        <h1 className={styles.title}>Create an order</h1>
        <p className={styles.subtitle}>
          New orders start as Pending until payment is confirmed.
        </p>

        {/* ---------- Form card ---------- */}
        {loading ? (
          <p className={styles.subtitle} style={{ marginTop: 24 }}>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className={styles.card}>
            {error && <div className={styles.formError}>{error}</div>}

            {/* Customer */}
            <div className={styles.field}>
              <label htmlFor="customer" className={styles.label}>
                Customer name
              </label>
              <select
                id="customer"
                value={customerId}
                onChange={(e) => setCustomerId(Number(e.target.value))}
                className={`${styles.control} ${styles.select} ${customerId === 0 ? styles.placeholder : ""}`}
              >
                <option value={0}>Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {customers.length === 0 && (
                <p className={styles.hint}>
                  No customers yet. <Link href="/customers/add">Add one</Link>
                </p>
              )}
            </div>

            {/* Product */}
            <div className={styles.field}>
              <label htmlFor="product" className={styles.label}>
                Product
              </label>
              <select
                id="product"
                value={productId}
                onChange={(e) => setProductId(Number(e.target.value))}
                className={`${styles.control} ${styles.select} ${productId === 0 ? styles.placeholder : ""}`}
              >
                <option value={0}>Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${Number(product.priceUsd).toFixed(2)}
                  </option>
                ))}
              </select>
              {selectedProduct && (
                <p className={styles.hint}>{Number(selectedProduct.quantity)} in stock</p>
              )}
            </div>

            {/* Quantity + Total */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="quantity" className={styles.label}>
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  step={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className={`${styles.control} ${overStock ? styles.warnBorder : ""}`}
                />
                {overStock && (
                  <p className={styles.warn}>
                    Only {Number(selectedProduct?.quantity)} in stock.
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="total" className={styles.label}>
                  Total (USD)
                </label>
                <div className={styles.prefixWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="total"
                    type="text"
                    readOnly
                    tabIndex={-1}
                    placeholder="0.00"
                    value={selectedProduct ? estimatedTotal.toFixed(2) : ""}
                    className={`${styles.control} ${styles.withPrefix} ${styles.readonly}`}
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className={styles.status}>
              <span className={styles.statusLabel}>Order status</span>
              <span className={styles.pill}>
                <span className={styles.dot} />
                Pending
              </span>
            </div>

            {/* ---------- Actions ---------- */}
            <div className={styles.actions}>
              <button type="submit" disabled={!canSubmit} className={styles.primary}>
                {saving ? "Creating..." : "Create order"}
              </button>

              <Link href="/orders" className={styles.secondary}>
                Cancel
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}