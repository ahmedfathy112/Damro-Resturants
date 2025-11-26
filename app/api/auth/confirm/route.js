import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseClient";

// This API route handles the token sent by the client-side page
// to securely confirm the email using the Supabase Service Role Key.
export async function POST(request) {
  try {
    const body = await request.json();
    const token = body.token_hash || body.token || null;
    const type = body.type || null;

    if (!token || !type) {
      return NextResponse.json(
        {
          error: "Missing token (token_hash or token) or type in request body",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      token: token,
      type: type,
    });

    if (error) {
      console.error("Supabase verification error:", error.message);
      return NextResponse.json(
        { error: error.message || "Failed to confirm email via API." },
        { status: 401 } // 401 is common for invalid/expired tokens
      );
    }

    // Success: The user's email is now confirmed.
    // We return a success message. The client-side code will handle the redirect.
    return NextResponse.json(
      { success: true, user: data.user },
      { status: 200 }
    );
  } catch (err) {
    console.error("/api/auth/confirm server error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error during confirmation" },
      { status: 500 }
    );
  }
}
