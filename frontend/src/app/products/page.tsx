"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "@/services/productService";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // delete flow
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

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
      await deleteProduct(toDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
      // A product that is already part of an order is usually rejected by the database
      setDeleteError(
        "Could not delete this product. It may be part of existing orders."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#F7F9F7] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Heading and Add Product button */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#43836C]" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#43836C]">
                Catalog
              </p>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#173B32] sm:text-4xl">
              Products
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#7A8982] sm:text-base">
              Manage your products, prices, and stock all in one place.
            </p>
          </div>

          <Link
            href="/products/add"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              height: 46,
              padding: "0 24px",
              color: "#FFFFFF",
              backgroundColor: "#174E40",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            className="rounded-xl text-sm font-semibold shadow-sm transition hover:shadow-md"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Main content card */}
        <section className="min-h-[360px] w-full overflow-hidden rounded-2xl border border-[#E2E9E4] bg-white shadow-[0_3px_14px_rgba(23,59,50,0.035)]">
          {loading ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E7F0EA] border-t-[#43836C]" />
              <p className="mt-4 text-sm text-[#7A8982]">
                Loading products...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-5 text-center">
              <p className="font-medium text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-[#174E40] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103D32]"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            /* Empty state */
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF5EF] text-[#43836C]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                  <path d="m3 12 9 5 9-5" />
                  <path d="m3 16 9 5 9-5" />
                </svg>
              </div>

              <span className="rounded-full bg-[#EDF5EF] px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-[#43836C]">
                YOUR CATALOG STARTS HERE
              </span>

              <h2 className="mt-4 text-xl font-bold tracking-tight text-[#173B32] sm:text-2xl">
                No products yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#7A8982]">
                Your products will appear here once you add them. Start building
                your catalog to keep track of prices and stock in one place.
              </p>

              <Link
                href="/products/add"
                style={{ backgroundColor: "#174E40", color: "#FFFFFF" }}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition hover:shadow-md"
              >
                <span className="text-xl leading-none">+</span>
                Add your first product
              </Link>

              <p className="mt-4 text-xs text-[#9AA69F]">
                You can update your product details anytime.
              </p>
            </div>
          ) : (
            /* Products from the backend */
            <>
              <div className="flex items-center justify-between border-b border-[#E8EEE9] px-5 py-4 sm:px-7">
                <div>
                  <h2 className="font-semibold text-[#173B32]">
                    Product catalog
                  </h2>
                  <p className="mt-1 text-sm text-[#7A8982]">
                    Manage your products and stock.
                  </p>
                </div>

                <span className="rounded-full border border-[#DDEBE1] bg-[#F0F7F1] px-3 py-1.5 text-xs font-semibold text-[#39765B]">
                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left">
                  <thead className="bg-[#F8FAF8]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#7A8982]">
                        Product
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#7A8982]">
                        SKU
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#7A8982]">
                        USD Price
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#7A8982]">
                        LBP Price
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#7A8982]">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#7A8982]">
                        Status
                      </th>
                      <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#7A8982]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EDF1EE]">
                    {products.map((product) => {
                      const quantity = Number(product.quantity ?? 0);
                      const threshold = Number(
                        product.lowStockThreshold ?? 0
                      );
                      const lowStock = quantity <= threshold;

                      return (
                        <tr
                          key={product.id}
                          className="transition-colors hover:bg-[#FAFCFA]"
                        >
                          <td className="px-6 py-5 font-semibold text-[#24473A]">
                            {product.name}
                          </td>

                          <td className="px-6 py-5 text-sm text-[#7A8982]">
                            {product.sku || "—"}
                          </td>

                          <td className="px-6 py-5 text-sm font-medium text-[#365449]">
                            ${Number(product.priceUsd ?? 0).toFixed(2)}
                          </td>

                          <td className="px-6 py-5 text-sm text-[#7A8982]">
                            {Number(
                              product.priceLbp ?? 0
                            ).toLocaleString()}{" "}
                            LBP
                          </td>

                          <td className="px-6 py-5 text-sm font-medium text-[#365449]">
                            {quantity}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${
                                lowStock
                                  ? "border-[#F0DFBF] bg-[#FFF8EB] text-[#A36B23]"
                                  : "border-[#DCEBE0] bg-[#F0F7F1] text-[#39765B]"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  lowStock
                                    ? "bg-[#C28A38]"
                                    : "bg-[#43836C]"
                                }`}
                              />
                              {lowStock ? "Low Stock" : "In Stock"}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-5">
                            <button
                              type="button"
                              onClick={() => setToDelete(product)}
                              aria-label={`Delete ${product.name}`}
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
                              className="rounded-full border border-solid border-red-200 bg-red-50 text-xs font-semibold leading-none text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                            >
                              <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
                              </svg>
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <p className="mt-5 text-center text-xs text-[#9AA69F]">
          SouqFlow · Your business, in motion.
        </p>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete product?"
        message={
          toDelete
            ? `${toDelete.name} will be removed from your catalog. This can't be undone.`
            : ""
        }
        confirmLabel="Delete product"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={closeDialog}
      />
    </main>
  );
}