
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import styles from "./login.module.css";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();                           // <-- add
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // Wrong email/password comes back as 401/403 from Spring Security
        setMessage(
          res.status === 401 || res.status === 403
            ? "Invalid email or password."
            : "Could not sign in. Please try again."
        );
        return;
      }

    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.fullName || "");

    router.push("/dashboard");
    } catch {
      setMessage("Cannot reach the server. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.loginLayout}>
        {/* LEFT BRAND PANEL */}
        <section className={styles.brandPanel}>
          <Link href="/" className={styles.brand} aria-label="SouqFlow home">
            <span className={styles.brandIcon}>
              <svg
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 24C11 24 12 17 19 17C25 17 27 11 35 11"
                  stroke="white"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M5 30C12 30 15 25 21 25C27 25 30 20 35 20"
                  stroke="#F5C451"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className={styles.brandText}>
              <strong>SouqFlow</strong>
              <small>MONEY, IN MOTION</small>
            </span>
          </Link>

          {/* SALES CARD */}
          <div className={styles.salesCard}>
            <span className={styles.salesLabel}>Today&apos;s sales</span>
            <strong className={styles.salesAmount}>$1,320</strong>

            <svg
              className={styles.salesChart}
              viewBox="0 0 220 48"
              preserveAspectRatio="none"
              fill="none"
              aria-label="Illustrative sales trend"
              role="img"
            >
              <path
                d="M2 36 L32 29 L59 34 L91 15 L121 22 L153 12 L184 18 L218 24"
                stroke="#43D9AE"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className={styles.salesGrowth}>
              <span aria-hidden="true">↗</span> +12% vs yesterday
            </span>
          </div>

          {/* DECORATIVE FLOW LINES */}
          <div className={styles.flowArtwork} aria-hidden="true">
            <svg
              viewBox="0 0 650 280"
              preserveAspectRatio="none"
              className={styles.flowSvg}
              fill="none"
            >
              <path
                d="M-35 158 C100 105 180 207 305 167 S505 37 690 15"
                stroke="#3AB69B"
                strokeWidth="1.4"
                opacity=".75"
              />
              <path
                d="M-35 172 C100 119 185 220 310 181 S510 51 690 29"
                stroke="#3AB69B"
                strokeWidth="1.2"
                opacity=".45"
              />
              <path
                d="M-35 186 C100 133 190 234 315 195 S515 65 690 43"
                stroke="#3AB69B"
                strokeWidth="1.2"
                opacity=".28"
              />
              <circle
                cx="425"
                cy="151"
                r="12"
                fill="#F5C451"
                opacity=".18"
              />
              <circle
                cx="425"
                cy="151"
                r="7"
                fill="#F5C451"
                stroke="#E8AD34"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* BRAND MESSAGE */}
          <div className={styles.brandMessage}>
            <span className={styles.eyebrow}>
              YOUR BUSINESS, IN FLOW
            </span>

            <h2>
              Every sale, every shade, every shelf — in flow.
            </h2>

            <p>
              Stock, sales and orders for beauty and small businesses,
              kept in one calm place.
            </p>
          </div>

          <div className={styles.panelDecoration} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>

        {/* RIGHT SIGN-IN PANEL */}
        <section className={styles.formPanel}>
          <div className={styles.formContainer}>
            <div className={styles.welcome}>
              <span className={styles.eyebrow}>WELCOME BACK</span>

              <h1>Sign in to SouqFlow</h1>

              <p>
                Pick up where you left off — your stock and orders are
                waiting.
              </p>
            </div>

            <form className={styles.loginForm} onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className={styles.fieldGroup}>
                <label htmlFor="email">Email</label>

                <div className={styles.inputWrapper}>
                  <svg
                    className={styles.inputIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="3.5"
                      y="5.5"
                      width="17"
                      height="13"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M4.5 7L12 12.5L19.5 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@yourbusiness.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className={styles.fieldGroup}>
                <div className={styles.passwordHeading}>
                  <label htmlFor="password">Password</label>

                  <Link href="/forgot-password" className={styles.forgotLink}>
                    Forgot password?
                  </Link>
                </div>

                <div className={styles.inputWrapper}>
                  <svg
                    className={styles.inputIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 10V7a4 4 0 0 1 8 0v3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="15" r="1" fill="currentColor" />
                  </svg>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M3 3L21 21M10.6 10.6a2 2 0 0 0 2.8 2.8"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.5 0 9 7 9 7a16 16 0 0 1-3.1 3.8M6.2 6.2C4.1 7.6 3 12 3 12s3.5 7 9 7c1.1 0 2.1-.2 3-.6"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* SIGN-IN BUTTON */}
              <button
                type="submit"
                className={styles.loginButton}
                disabled={isLoading}
              >
                <span>{isLoading ? "Signing in..." : "Sign in"}</span>

                {!isLoading && (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12h14m-6-6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {message && (
                <p className={styles.statusMessage} role="status">
                  {message}
                </p>
              )}
            </form>

            {/* DIVIDER */}
            <div className={styles.divider}>
              <span />
              <p>NEW HERE?</p>
              <span />
            </div>

            {/* CREATE ACCOUNT */}
            <Link href="/register" className={styles.registerButton}>
              Create an account
            </Link>

            {/* PRIVACY NOTE */}
            <div className={styles.privacyNote}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3 19 6v5c0 4.7-3 8-7 10-4-2-7-5.3-7-10V6l7-3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="m9 12 2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>Your business data is encrypted and private.</span>
            </div>
          </div>

          <p className={styles.mobileBrand}>
            <span className={styles.mobileBrandDot}>S</span>
            SouqFlow <span>·</span> MONEY, IN MOTION
          </p>
        </section>
      </div>
    </main>
  );
}
