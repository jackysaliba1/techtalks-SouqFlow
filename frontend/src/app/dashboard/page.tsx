"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import { getOrders } from "@/services/orderService";
import { getDashboard } from "@/services/dashboardService";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";
import type { Dashboard } from "@/services/dashboardService";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [productsData, ordersData, dashboardData] =
            await Promise.all([
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

  const lowStockProducts = products.filter(
      (product) =>
          product.quantity > 0 &&
          product.quantity <= product.lowStockThreshold
  );

  const outOfStockProducts = products.filter(
      (product) => product.quantity <= 0
  );

  const totalOrders = orders.length;

  return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          {loading ? (
              <p>Loading dashboard...</p>
          ) : error ? (
              <p className="rounded border border-red-300 bg-red-50 p-4 text-red-700">
                {error}
              </p>
          ) : dashboard ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                      Total Products
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {dashboard.totalProducts}
                    </p>
                  </div>

                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                      Total Stock Units
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {dashboard.totalStockUnits}
                    </p>
                  </div>

                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                      Low Stock
                    </p>
                    <p className="mt-2 text-3xl font-bold text-yellow-600">
                      {dashboard.lowStockCount}
                    </p>
                  </div>

                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                      Out of Stock
                    </p>
                    <p className="mt-2 text-3xl font-bold text-red-600">
                      {dashboard.outOfStockCount}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Total Orders
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {totalOrders}
                  </p>
                </div>

                <section className="mt-8 rounded-lg border bg-white shadow-sm">
                  <div className="border-b p-6">
                    <h2 className="text-xl font-semibold">
                      Stock Alerts
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Products that need your attention
                    </p>
                  </div>

                  {lowStockProducts.length === 0 &&
                  outOfStockProducts.length === 0 ? (
                      <div className="p-6 text-gray-600">
                        No stock alerts. All products have enough
                        stock.
                      </div>
                  ) : (
                      <div className="divide-y">
                        {outOfStockProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-6"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {product.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                  Current quantity:{" "}
                                  {product.quantity}
                                </p>
                              </div>

                              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                                                Out of Stock
                                            </span>
                            </div>
                        ))}

                        {lowStockProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-6"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {product.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                  {product.quantity} left ·
                                  Threshold:{" "}
                                  {product.lowStockThreshold}
                                </p>
                              </div>

                              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                                Low Stock
                                            </span>
                            </div>
                        ))}
                      </div>
                  )}
                </section>
              </>
          ) : null}
        </div>
      </main>
  );
}