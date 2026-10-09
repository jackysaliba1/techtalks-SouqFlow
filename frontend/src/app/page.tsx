"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

import styles from "./login.module.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log({
            email,
            password,
        });
    };

    return (
        <main className={styles.page}>
            <div className={styles.loginBox}>
                {/* LEFT SIDE IMAGE */}
                <div className={styles.imageSection}>
                    <Image
                        src="/login/img-01.png"
                        alt="Login illustration"
                        width={316}
                        height={289}
                        className={styles.loginImage}
                        priority
                    />
                </div>

                {/* RIGHT SIDE LOGIN */}
                <form
                    className={styles.loginForm}
                    onSubmit={handleSubmit}
                >
                    <h1 className={styles.title}>SouqFlow</h1>

                    {/* EMAIL */}
                    <div className={styles.inputWrapper}>
                        <span className={styles.icon}>✉</span>

                        <input
                            className={styles.input}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className={styles.inputWrapper}>
                        <span className={styles.icon}>🔒</span>

                        <input
                            className={styles.input}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        className={styles.loginButton}
                        type="submit"
                    >
                        Login
                    </button>

                    {/* REGISTER */}
                    <div className={styles.register}>
                        <Link href="/register">
                            Create your Account →
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}