"use client";

import { useEffect, type CSSProperties } from "react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Inline styles on purpose, so global CSS can't break the dialog.
const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  background: "rgba(11, 42, 34, 0.45)",
};

const box: CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  maxWidth: 400,
  padding: 24,
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 24px 48px rgba(8, 56, 45, 0.25)",
};

const buttonBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 38,
  padding: "0 18px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "inherit",
  borderRadius: 10,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  loading = false,
  error = "",
  onConfirm,
  onCancel,
}: Props) {
  // Close with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div style={overlay} onClick={() => !loading && onCancel()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        style={box}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "grid",
            placeItems: "center",
            width: 40,
            height: 40,
            marginBottom: 14,
            color: "#dc2626",
            background: "#fdecec",
            borderRadius: 12,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
          </svg>
        </div>

        <h2 id="confirm-title" style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0b2a22" }}>
          {title}
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.5, color: "#6b7c76" }}>{message}</p>

        {error && (
          <p
            style={{
              margin: "14px 0 0",
              padding: "10px 12px",
              fontSize: 12,
              color: "#b42318",
              background: "#fef3f2",
              border: "1px solid #fecdca",
              borderRadius: 10,
            }}
          >
            {error}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{ ...buttonBase, color: "#0b2a22", background: "#fff", border: "1px solid #e1e8e5" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              ...buttonBase,
              color: "#fff",
              background: "#dc2626",
              border: "1px solid #dc2626",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}