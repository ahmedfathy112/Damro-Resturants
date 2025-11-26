import { NextResponse } from "next/server";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const token_hash = body.token_hash || body.token || null;
    const type = body.type || null;

    if (!token_hash || !type) {
      return NextResponse.json(
        { error: "Missing token_hash or type" },
        { status: 400 }
      );
    }

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error("Supabase env missing", {
        SUPABASE_URL: !!SUPABASE_URL,
        SERVICE_ROLE_KEY: !!SERVICE_ROLE_KEY,
      });
      return NextResponse.json(
        { error: "Missing Supabase configuration on server" },
        { status: 500 }
      );
    }

    const resp = await fetch(
      `${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          apikey: SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({ token: token_hash, type }),
      }
    );

    const data = await resp.json().catch(() => null);
    if (!resp.ok) {
      console.error("Supabase verify failed", { status: resp.status, data });
      return NextResponse.json(
        { error: data || "verify failed" },
        { status: resp.status }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("/api/auth/confirm error:", err);
    return NextResponse.json(
      { error: err?.message || "server error" },
      { status: 500 }
    );
  }
}
