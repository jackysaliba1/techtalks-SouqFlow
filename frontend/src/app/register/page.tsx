"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type FieldErrors = { fullName?: string; businessName?: string; email?: string; password?: string };

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!businessName.trim()) e.businessName = "Business name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
    if (password.length < 8 || !/\d/.test(password))
      e.password = "Use at least 8 characters with a number";
    return e;
  }
  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setFormError("");

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
            const res = await fetch(`${API_URL}/auth/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fullName, businessName: businessName.trim(), email, password }),
            });

            // Backend returns plain text ("Registered successfully" / "Email already in use")
            const message = await res.text();

            if (!res.ok) {
              throw new Error(message || "Could not create account");
            }

            router.push("/login");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      {/* ---------- Left brand panel ---------- */}
      <aside className={styles.brand}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 15c3-4 6 2 9-2s5-3 7-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 20c3-4 6 2 9-2s5-3 7-6" stroke="#f5c542" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className={styles.logoName}>
              Souq<span>Flow</span>
            </div>
            <span className={styles.logoTag}>MONEY, IN MOTION</span>
          </div>
        </div>

        <svg className={styles.wave} viewBox="0 0 400 160" preserveAspectRatio="none" fill="none">
          <path d="M0 120 C80 130 120 60 200 70 S330 20 400 10" stroke="rgba(160,230,205,0.55)" strokeWidth="1.2" />
          <path d="M0 132 C80 142 120 72 200 82 S330 32 400 22" stroke="rgba(160,230,205,0.35)" strokeWidth="1.2" />
          <path d="M0 144 C80 154 120 84 200 94 S330 44 400 34" stroke="rgba(160,230,205,0.2)" strokeWidth="1.2" />
          <circle cx="200" cy="70" r="12" stroke="rgba(245,197,66,0.5)" strokeWidth="1.2" />
          <circle cx="200" cy="70" r="5" fill="#f5c542" />
        </svg>

        <div className={styles.brandBottom}>
          <h2 className={styles.headline}>Run your shop with the clarity of a ledger.</h2>
          <ul className={styles.features}>
            {[
              "Live stock levels with low-stock alerts",
              "Sales and orders tracked in one view",
              "Customer records that remember every client",
            ].map((t) => (
              <li key={t}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5 9-10" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ---------- Right form panel ---------- */}
      <section className={styles.formSide}>
        <form className={styles.formWrap} onSubmit={handleSubmit} noValidate>
          <p className={styles.eyebrow}>GET STARTED</p>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Set up your workspace in under a minute.</p>

          {formError && <div className={styles.formError}>{formError}</div>}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="fullName">Full name</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
              </span>
              <input
                id="fullName"
                className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="businessName">Business name</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" /></svg>
              </span>
              <input
                id="businessName"
                className={`${styles.input} ${errors.businessName ? styles.inputError : ""}`}
                type="text"
                placeholder="Your shop or company name"
                autoComplete="organization"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            {errors.businessName && <p className={styles.error}>{errors.businessName}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
              </span>
              <input
                id="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                type="email"
                placeholder="you@yourbusiness.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
              </span>
              <input
                id="password"
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password ? (
              <p className={styles.error}>{errors.password}</p>
            ) : (
              <p className={styles.hint}>
                Use at least 8 characters with a <b>number</b>.
              </p>
            )}
          </div>

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
            {!loading && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            )}
          </button>

          <p className={styles.signin}>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </form>
      </section>
    </main>
  );
}