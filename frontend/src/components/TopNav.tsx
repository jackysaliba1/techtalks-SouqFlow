"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/inventory", label: "Inventory" },
  { href: "/customers", label: "Customers" },
  { href: "/orders", label: "Orders" },
];

export default function TopNav() {
  const pathname = usePathname();

  const [userName, setUserName] = useState("");
  const userRole = "Owner";

  // Reload the logged-in user every time the page changes, so the navbar
  // always matches the current token (login, logout, switching accounts).
  useEffect(() => {
    let cancelled = false;

    let token: string | null = null;
    try {
      token = localStorage.getItem("token");
    } catch {
      /* storage unavailable */
    }

    if (!token) {
      setUserName("");
      return;
    }

    apiFetch<{ fullName?: string; email?: string }>("/me")
      .then((me) => {
        if (!cancelled) setUserName(me.fullName || me.email || "");
      })
      .catch(() => {
        if (!cancelled) setUserName("");
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const initials = userName
    ? userName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("")
    : "?";

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#1a8f6f]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 15c3-4 6 2 9-2s5-3 7-6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 20c3-4 6 2 9-2s5-3 7-6"
                  stroke="#f5c542"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span>
              <span className="block text-[15px] font-bold leading-none text-[#0b2a22]">
                Souq<span className="text-[#0f8466]">Flow</span>
              </span>
              <span className="mt-0.5 block text-[7px] font-semibold tracking-[0.18em] text-[#0f8466]">
                MONEY, IN MOTION
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-emerald-50 text-[#0f6b55]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="relative grid h-8 w-8 place-items-center rounded-full text-gray-500 hover:bg-gray-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 004 0" />
            </svg>
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>

          <Link
            href="/profile"
            aria-label="Open profile"
            style={{ textDecoration: "none" }}
            className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition ${
              pathname.startsWith("/profile")
                ? "border-emerald-200 bg-emerald-50"
                : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"
            }`}
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0f6b55] text-[10px] font-bold text-white">
              {initials}
            </span>

            <span className="hidden leading-tight sm:block">
              <span className="block text-[11px] font-semibold text-gray-900">
                {userName || "My account"}
              </span>
              <span className="block text-[9px] text-gray-500">
                {userRole}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}