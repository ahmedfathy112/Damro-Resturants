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
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");

        if (!accessToken) {
          setError("No access token received");
          setTimeout(() => router.push("/user/login"), 2000);
          return;
        }

        // Store tokens in localStorage
        localStorage.setItem("access_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        // Set Supabase session
        try {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || undefined,
          });
        } catch (e) {
          console.warn("Failed to set session:", e);
          // Continue anyway, token is stored in localStorage
        }

        // Call backend to create user profile if it doesn't exist
        // This ensures customer profile is created on first sign-in
        try {
          const response = await fetch("/api/auth/create-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accessToken,
              refreshToken,
            }),
          });

          if (!response.ok) {
            const errData = await response.json();
            console.warn("Profile creation warning:", errData);
            // Don't fail, continue with redirect
          } else {
            const profileData = await response.json();
            console.log("Profile creation success:", profileData);
          }
        } catch (profileError) {
          console.warn("Profile creation error:", profileError);
          // Non-critical, continue with redirect
        }

        // Clean up URL and redirect to home
        setLoading(false);
        window.location.replace("/");
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
              Authentication Failed
            </h2>
            <p style={{ color: "#666", marginBottom: "10px" }}>{error}</p>
            <p style={{ color: "#999", fontSize: "14px" }}>
              Redirecting to login...
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
              Signing you in...
            </h2>
            <p style={{ color: "#666" }}>Setting up your account</p>
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
