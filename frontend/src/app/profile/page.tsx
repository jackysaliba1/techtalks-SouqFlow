"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Me = {
  fullName?: string;
  email?: string;
  merchantName?: string;
};

// Fallback while the backend /auth/me endpoint doesn't exist yet:
// read the email (the JWT "sub") straight from the token.
function readTokenEmail(): string {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "";
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return typeof payload.sub === "string" ? payload.sub : "";
  } catch {
    return "";
  }
}

function initials(text: string) {
  const parts = text.trim().split(/[\s@._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[1][0] : "")).toUpperCase();
}

const s: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: "#f3f6f4" },
  container: {
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 760,
    margin: "0 auto",
    padding: "28px 24px 40px",
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
  sub: { margin: "6px 0 0", fontSize: 12, color: "#6b7c76" },
  card: {
    boxSizing: "border-box",
    marginTop: 22,
    padding: "24px",
    background: "#fff",
    border: "1px solid #edf1ef",
    borderRadius: 16,
    boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
  },
  identity: { display: "flex", alignItems: "center", gap: 16 },
  avatar: {
    display: "grid",
    placeItems: "center",
    width: 64,
    height: 64,
    flexShrink: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(160deg, #0f6b55 0%, #08382d 100%)",
    borderRadius: "50%",
  },
  name: { margin: 0, fontSize: 20, fontWeight: 700, color: "#0b2a22" },
  email: { margin: "2px 0 0", fontSize: 12, color: "#6b7c76" },
  rows: { margin: "18px 0 0", padding: 0, listStyle: "none" },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 0",
    borderTop: "1px solid #f1f4f2",
  },
  rowLabel: { fontSize: 11, color: "#8a6a4a" },
  rowValue: { fontSize: 12, fontWeight: 700, color: "#0b2a22", textAlign: "right" },
  cardTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: "#0b2a22" },
  cardText: { margin: "6px 0 0", fontSize: 12, color: "#6b7c76" },
  logout: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
    marginTop: 16,
    padding: "0 18px",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "inherit",
    color: "#dc2626",
    background: "#fdecec",
    border: "1px solid #fecdca",
    borderRadius: 10,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  notice: {
    marginTop: 16,
    padding: "10px 12px",
    fontSize: 12,
    color: "#8a5a00",
    background: "#fff8eb",
    border: "1px solid #f0dfbf",
    borderRadius: 10,
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch<Me>("/me");
        setMe(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        // Endpoint missing or failing: show what the token already tells us.
        const email = readTokenEmail();
        setMe({ email });
        setNotice(
          "Showing limited details. Could not load your full profile."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function logout() {
    try {
      localStorage.removeItem("token");
    } catch {
      /* storage unavailable, redirect anyway */
    }
    router.replace("/login");
  }

  const display = me?.fullName || me?.email || "Your account";

  return (
    <div style={s.page}>
      <main style={s.container}>
        <p style={s.eyebrow}>Account</p>
        <h1 style={s.title}>Profile</h1>
        <p style={s.sub}>Your account details and session.</p>

        {loading ? (
          <p style={{ ...s.sub, marginTop: 24 }}>Loading profile...</p>
        ) : (
          <>
            <section style={s.card}>
              <div style={s.identity}>
                <div style={s.avatar}>{initials(display)}</div>
                <div>
                  <p style={s.name}>{display}</p>
                  {me?.email && <p style={s.email}>{me.email}</p>}
                </div>
              </div>

              <ul style={s.rows}>
                <li style={s.row}>
                  <span style={s.rowLabel}>Full name</span>
                  <span style={s.rowValue}>{me?.fullName || "—"}</span>
                </li>
                <li style={s.row}>
                  <span style={s.rowLabel}>Email</span>
                  <span style={s.rowValue}>{me?.email || "—"}</span>
                </li>
                <li style={s.row}>
                  <span style={s.rowLabel}>Business</span>
                  <span style={s.rowValue}>{me?.merchantName || "—"}</span>
                </li>
              </ul>

              {notice && <p style={s.notice}>{notice}</p>}
            </section>

            <section style={s.card}>
              <h2 style={s.cardTitle}>Session</h2>
              <p style={s.cardText}>
                Log out to end your session on this device.
              </p>
              <button type="button" onClick={logout} style={s.logout}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Log out
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}