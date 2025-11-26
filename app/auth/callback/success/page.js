"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function OAuthSuccessPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleOAuthCallback() {
      try {
        const tokenHash =
          searchParams.get("token_hash") || searchParams.get("token");
        const type = searchParams.get("type");
        const accessToken =
          searchParams.get("access_token") || searchParams.get("accessToken");
        const refreshToken =
          searchParams.get("refresh_token") || searchParams.get("refreshToken");

        // Case A: Email confirmation (verify OTP)
        if (tokenHash && type) {
          try {
            console.log("Verifying email token:", { tokenHash, type });
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
              type,
              token: tokenHash,
            });

            if (verifyError) {
              console.error("Email confirmation failed:", verifyError);
              setError("فشل تأكيد البريد الإلكتروني: " + verifyError.message);
              setTimeout(() => router.push("/user/login"), 3000);
              return;
            }

            // success -> redirect to login with flag
            setLoading(false);
            window.location.replace("/user/login?confirmed=true");
            return;
          } catch (e) {
            console.error("verifyOtp error:", e);
            setError("حدث خطأ أثناء تأكيد البريد الإلكتروني");
            setTimeout(() => router.push("/user/login"), 3000);
            return;
          }
        }

        // Case B: OAuth token flow
        if (accessToken) {
          // Store tokens in localStorage
          try {
            localStorage.setItem("access_token", accessToken);
            if (refreshToken)
              localStorage.setItem("refresh_token", refreshToken);
          } catch (e) {
            console.warn("Failed to store tokens:", e);
          }

          // Set Supabase session
          try {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || undefined,
            });
          } catch (e) {
            console.warn("Failed to set session:", e);
          }

          // Try to create app profile (non-blocking)
          try {
            const response = await fetch("/api/auth/create-profile", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken, refreshToken }),
            });

            if (!response.ok) {
              const errData = await response.json().catch(() => null);
              console.warn("Profile creation warning:", errData);
            } else {
              const profileData = await response.json().catch(() => null);
              console.log("Profile creation success:", profileData);
            }
          } catch (profileError) {
            console.warn("Profile creation error:", profileError);
          }

          // Clean up URL and redirect to home
          setLoading(false);
          window.location.replace("/");
          return;
        }

        // Nothing matched
        setError("No valid parameters received");
        setTimeout(() => router.push("/user/login"), 2000);
      } catch (e) {
        console.error("OAuth callback error:", e);
        setError("Authentication failed");
        setTimeout(() => router.push("/user/login"), 3000);
      }
    }

    handleOAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        {error ? (
          <div>
            <h2 style={{ color: "#d32f2f", marginBottom: "10px" }}>
              فشل تسجيل الدخول
            </h2>
            <p style={{ color: "#666", marginBottom: "10px" }}>{error}</p>
            <p style={{ color: "#999", fontSize: "14px" }}>
              التوجبة إلى صفحة تسجيل الدخول...
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #03081f",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            ></div>
            <h2 style={{ color: "#03081f", marginBottom: "10px" }}>
              تسجيل الدخول ناجح
            </h2>
            <p style={{ color: "#666" }}>اعداد الحساب</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
