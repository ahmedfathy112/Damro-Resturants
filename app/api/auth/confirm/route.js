import { NextResponse } from "next/server";
import { supabaseServer } from "../../lib/supabaseServer"; // Using the Server Client initialized with Service Role Key

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

    // --- FIX APPLIED HERE: Use the official Supabase SDK (supabaseServer) ---
    // The verifyOtp function is the correct method for a server-side exchange
    // of the token hash and type (which will be 'signup' or 'email')

    // Note: The 'token' in the verifyOtp call should be the token_hash from the URL.
    // The 'type' should be one of 'signup', 'invite', 'magiclink', etc.

    // For email confirmation links, the 'type' in the URL is typically 'signup'.
    const { data, error } = await supabaseServer.auth.verifyOtp({
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
