import { apiFetch } from "@/lib/api";

interface LoginResponse {
    token: string;
}

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {
    return apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export async function register(
    fullName: string,
    email: string,
    password: string
): Promise<string> {
    return apiFetch<string>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
            fullName,
            email,
            password,
        }),
    });
}