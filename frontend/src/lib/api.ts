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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...headers,
            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
}