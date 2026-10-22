import { NextRequest, NextResponse } from "next/server";

const backendUrl = (process.env.BACKEND_API_URL ?? "http://localhost:5000/api").replace(/\/$/, "");

async function proxy(request: NextRequest, path: string[]) {
  const allowed = new Set(["analytics", "products", "customers", "orders"]);
  if (!path.length || !allowed.has(path[0])) {
    return NextResponse.json({ message: "Route not found." }, { status: 404 });
  }

  const target = `${backendUrl}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const headers = new Headers({ Accept: "application/json" });
  const apiKey = process.env.API_WRITE_KEY;
  if (apiKey) headers.set("x-api-key", apiKey);

  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
    if (body) headers.set("content-type", request.headers.get("content-type") ?? "application/json");
  }

  try {
    const response = await fetch(target, { method: request.method, headers, body, cache: "no-store", signal: AbortSignal.timeout(10_000) });
    return new NextResponse(response.body, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json", "cache-control": "no-store" },
    });
  } catch {
    return NextResponse.json({ message: "The store API is temporarily unavailable." }, { status: 502 });
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };
export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}
export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}
