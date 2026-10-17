export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type ApiOptions = RequestInit & {
    token?: string;
};

export async function apiFetch<T>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const { token, headers, ...rest } = options;

    const storedToken =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

    const authToken = token || storedToken;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...headers,
            ...(authToken
                ? { Authorization: `Bearer ${authToken}` }
                : {}),
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        return response.json() as Promise<T>;
    }

    return response.text() as Promise<T>;
}