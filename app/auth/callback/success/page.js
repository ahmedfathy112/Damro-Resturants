"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function OAuthSuccessPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleOAuthCallback() {
      try {
        setLoading(true);
        const tokenHash = searchParams.get("token_hash");
        const type = searchParams.get("type");
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");

        console.log("Auth callback parameters:", {
          tokenHash: !!tokenHash,
          type,
          accessToken: !!accessToken,
        });

        // Case 1: Email confirmation flow
        if (tokenHash && type === "signup") {
          try {
            const resp = await fetch("/api/auth/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token_hash: tokenHash, type }),
            });

            const data = await resp.json();

            if (!resp.ok) {
              throw new Error(
                data?.error?.message || "فشل في تأكيد البريد الإلكتروني"
              );
            }

            setSuccess(true);
            setLoading(false);

            // Redirect to login with success message after short delay
            setTimeout(() => {
              router.push("/user/login?confirmed=true");
            }, 2000);
            return;
          } catch (err) {
            console.error("Email confirmation error:", err);
            setError(err.message || "حدث خطأ غير متوقع");
            setLoading(false);
            return;
          }
        }

        // Case 2: OAuth flow (social login)
        if (accessToken) {
          try {
            // Store tokens securely
            if (typeof window !== "undefined") {
              localStorage.setItem("supabase.auth.token", accessToken);
              if (refreshToken) {
                localStorage.setItem(
                  "supabase.auth.refreshToken",
                  refreshToken
                );
              }
            }

            // Set Supabase session
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || undefined,
            });

            if (sessionError) throw sessionError;

            // Create user profile (non-blocking)
            try {
              await fetch("/api/auth/create-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken, refreshToken }),
              });
            } catch (profileErr) {
              console.warn("Profile creation warning:", profileErr);
              // Continue even if profile creation fails
            }

            setSuccess(true);
            setLoading(false);

            // Redirect to dashboard/home
            setTimeout(() => {
              router.push("/dashboard");
            }, 1500);
            return;
          } catch (err) {
            console.error("OAuth session error:", err);
            setError("فشل في إنشاء الجلسة، يرجى المحاولة مرة أخرى");
            setLoading(false);
            return;
          }
        }

        // Case 3: No valid parameters found
        setError("لم يتم العثور على بيانات مصادقة صالحة");
        setLoading(false);
      } catch (err) {
        console.error("Unexpected auth error:", err);
        setError("حدث خطأ غير متوقع أثناء المصادقة");
        setLoading(false);
      }
    }

    handleOAuthCallback();
  }, [searchParams, router]);

  // Render loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            جاري المعالجة
          </h2>
          <p style={{ color: "#6b7280" }}>جاري تأكيد حسابك، يرجى الانتظار...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Render success state
  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#dcfce7",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg
              style={{ width: "32px", height: "32px", color: "#16a34a" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#16a34a",
              marginBottom: "8px",
            }}
          >
            تمت العملية بنجاح!
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "16px" }}>
            {searchParams.get("type") === "signup"
              ? "تم تأكيد بريدك الإلكتروني بنجاح، جاري توجيهك إلى صفحة تسجيل الدخول..."
              : "تم تسجيل الدخول بنجاح، جاري توجيهك إلى لوحة التحكم..."}
          </p>
        </div>
      </div>
    );
  }

  // Render error state
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "28rem",
          margin: "0 16px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: "#fee2e2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg
            style={{ width: "32px", height: "32px", color: "#dc2626" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#dc2626",
            marginBottom: "8px",
          }}
        >
          فشل في المصادقة
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "16px" }}>{error}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              width: "100%",
              backgroundColor: "#2563eb",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            إعادة المحاولة
          </button>
          <button
            onClick={() => router.push("/user/login")}
            style={{
              width: "100%",
              backgroundColor: "#e5e7eb",
              color: "#374151",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#d1d5db")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
          >
            العودة إلى تسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
}
