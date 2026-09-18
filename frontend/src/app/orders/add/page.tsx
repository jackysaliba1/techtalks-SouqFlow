"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createOrder } from "@/services/orderService";
import { getCustomers } from "@/services/customerService";
import { getProducts } from "@/services/productService";

import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";

export default function CreateOrderPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [customerId, setCustomerId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [customerData, productData] = await Promise.all([
          getCustomers(),
          getProducts(),
        ]);

        setCustomers(customerData);
        setProducts(productData);

        if (customerData.length > 0) {
          setCustomerId(customerData[0].id);
        }

        if (productData.length > 0) {
          setProductId(productData[0].id);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load customers or products.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const selectedProduct = products.find(
    (product) => product.id === productId
  );

  const estimatedTotal = selectedProduct
    ? Number(selectedProduct.priceUsd) * quantity
    : 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      setError("Failed to create order.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

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
              Customer
            </label>

            <select
              value={customerId}
              onChange={(e) => setCustomerId(Number(e.target.value))}
              className="w-full rounded-lg border px-4 py-3 text-gray-900"
              required
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Product
            </label>

            <select
              value={productId}
              onChange={(e) => setProductId(Number(e.target.value))}
              className="w-full rounded-lg border px-4 py-3 text-gray-900"
              required
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${Number(product.priceUsd).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-lg border px-4 py-3 text-gray-900"
              required
            />
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Estimated Total
            </p>

            <p className="text-xl font-bold text-gray-900">
              ${estimatedTotal.toFixed(2)}
            </p>
          </div>

          <p className="text-sm text-gray-500">
            New orders are created with PENDING status.
          </p>

          {error && (
            <p className="text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={
              saving ||
              customers.length === 0 ||
              products.length === 0
            }
            className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Order"}
          </button>
        </form>
      </div>
    </main>
  );
}