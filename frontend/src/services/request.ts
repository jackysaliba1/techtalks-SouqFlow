export async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(endpoint, {
        ...options,
        headers: { "Content-Type": "application/json", ...options.headers },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const fields = data?.fields
            ? Object.values(data.fields).join(", ")
            : "";
        const message = [data?.error, fields].filter(Boolean).join(": ");
        throw new Error(message || `Request failed: ${response.status}`);
    }

    return data as T;
}