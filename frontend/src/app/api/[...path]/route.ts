import { NextRequest } from "next/server";

const BACKEND = "http://localhost:8080";

async function proxy(
    req: NextRequest,
    ctx: { params: Promise<{ path: string[] }> }
) {
    const { path } = await ctx.params;
    const url = `${BACKEND}/api/${path.join("/")}${req.nextUrl.search}`;

    const headers = new Headers(req.headers);
    headers.delete("origin");
    headers.delete("referer");
    headers.delete("host");

    const hasBody = req.method !== "GET" && req.method !== "HEAD";

    const res = await fetch(url, {
        method: req.method,
        headers,
        body: hasBody ? await req.text() : undefined,
        cache: "no-store",
    });

    return new Response(await res.text(), {
        status: res.status,
        headers: {
            "Content-Type": res.headers.get("content-type") ?? "application/json",
        },
    });
}

export {
    proxy as GET,
    proxy as POST,
    proxy as PUT,
    proxy as PATCH,
    proxy as DELETE,
};
