import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { accessToken, refreshToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token provided" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey =
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

    // Use service role key to perform server-side operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authenticated user info using the access token
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(accessToken);

    if (userError || !userData?.user) {
      // Fallback: decode and extract user info from token
      try {
        const parts = accessToken.split(".");
        if (parts.length < 2) {
          return NextResponse.json(
            { error: "Invalid token format" },
            { status: 401 }
          );
        }

        const payload = parts[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const pad = base64.length % 4;
        const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
        const decoded = JSON.parse(atob(padded));

        const userId = decoded.sub;
        const email = decoded.email;
        const fullName =
          decoded.user_metadata?.full_name ||
          decoded.email?.split("@")[0] ||
          "User";

        // Check if user exists in app_users
        const { data: existingUser, error: fetchError } = await supabase
          .from("app_users")
          .select("id")
          .eq("id", userId)
          .single();

        // If user doesn't exist, create profile
        if (fetchError?.code === "PGRST116" || !existingUser) {
          const { error: insertError } = await supabase
            .from("app_users")
            .insert([
              {
                id: userId,
                full_name: fullName,
                email: email,
                user_type: "customer", // Set as customer for OAuth users
              },
            ]);

          if (insertError) {
            console.error("Error creating user profile:", insertError);
            // Don't fail the flow, user can still login
          } else {
            console.log("User profile created successfully for:", userId);
          }
        }

        return NextResponse.json({
          success: true,
          userId,
          email,
          fullName,
        });
      } catch (tokenError) {
        console.error("Error processing token:", tokenError);
        return NextResponse.json(
          { error: "Failed to process authentication" },
          { status: 500 }
        );
      }
    }

    // Extract user info from Supabase admin response
    const userId = userData.user.id;
    const email = userData.user.email;
    const fullName =
      userData.user.user_metadata?.full_name ||
      userData.user.user_metadata?.name ||
      userData.user.email?.split("@")[0] ||
      "User";

    // Check if user already exists in app_users
    const { data: existingUser, error: fetchError } = await supabase
      .from("app_users")
      .select("id")
      .eq("id", userId)
      .single();

    // If user doesn't exist in app_users, create profile
    if (fetchError?.code === "PGRST116" || !existingUser) {
      const { error: insertError } = await supabase.from("app_users").insert([
        {
          id: userId,
          full_name: fullName,
          email: email,
          user_type: "customer",
        },
      ]);

      if (insertError) {
        console.error("Error creating user profile:", insertError);
        // Don't fail the flow, user can still login
      } else {
        console.log("User profile created successfully for:", userId);
      }
    }

    return NextResponse.json({
      success: true,
      userId,
      email,
      fullName,
    });
  } catch (error) {
    console.error("Auth profile creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
