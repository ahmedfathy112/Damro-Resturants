import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(request) {
  try {
    const body = await request.json();
    const token = body.token_hash || body.token || null;
    const type = body.type || null;

    // Validate required parameters
    if (!token || !type) {
      return NextResponse.json(
        {
          error: "بيانات ناقصة: يرجى التأكد من وجود رمز التأكيد ونوع العملية",
          code: "MISSING_PARAMETERS",
        },
        { status: 400 }
      );
    }

    // Validate token format (basic check)
    if (token.length < 10) {
      return NextResponse.json(
        { error: "رمز التأكيد غير صالح", code: "INVALID_TOKEN_FORMAT" },
        { status: 400 }
      );
    }

    // Validate type parameter
    const allowedTypes = ["signup", "email", "recovery", "invite"];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { error: "نوع العملية غير مدعوم", code: "INVALID_TYPE" },
        { status: 400 }
      );
    }

    console.log(`Attempting to verify OTP for type: ${type}`);

    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      token: token,
      type: type,
    });

    if (error) {
      console.error("Supabase OTP verification error:", {
        message: error.message,
        type: type,
        status: error.status,
      });

      // Provide more specific error messages
      let errorMessage = "فشل في تأكيد البريد الإلكتروني";
      let statusCode = 401;

      switch (error.message) {
        case "Token has expired or is invalid":
          errorMessage = "انتهت صلاحية رمز التأكيد، يرجى طلب رمز جديد";
          statusCode = 410; // Gone
          break;
        case "Email link is invalid or has expired":
          errorMessage = "رابط التأكيد غير صالح أو منتهي الصلاحية";
          statusCode = 410;
          break;
        case "User not found":
          errorMessage = "لم يتم العثور على المستخدم";
          statusCode = 404;
          break;
      }

      return NextResponse.json(
        {
          error: errorMessage,
          code: error.code || "VERIFICATION_FAILED",
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: statusCode }
      );
    }

    // Success: The user's email is now confirmed
    console.log("Email confirmed successfully for user:", {
      user_id: data.user?.id,
      email: data.user?.email,
      type: type,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          email_confirmed: data.user?.email_confirmed_at !== null,
        },
        message: "تم تأكيد بريدك الإلكتروني بنجاح",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("/api/auth/confirm server error:", err);

    return NextResponse.json(
      {
        error: "حدث خطأ داخلي في الخادم",
        code: "INTERNAL_SERVER_ERROR",
        ...(process.env.NODE_ENV === "development" && { details: err.message }),
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for health check or testing
export async function GET() {
  return NextResponse.json(
    {
      status: "active",
      service: "email-confirmation",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
