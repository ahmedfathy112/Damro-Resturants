"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { FaCheckCircle, FaTimesCircle, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../../context/Authcontext";

const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [message, setMessage] = useState("جاري التحقق من البريد الإلكتروني...");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error");
        setMessage("رابط التفعيل غير صالح أو منتهي الصلاحية");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token_hash: token, type: type || "signup" }),
        });

        const result = await res.json();

        if (!res.ok) {
          console.error("Verify endpoint error:", result);
          setVerificationStatus("error");
          setMessage(result.error || "فشل في تفعيل البريد الإلكتروني");
        } else {
          setVerificationStatus("success");
          setMessage(result.message || "تم تفعيل بريدك الإلكتروني بنجاح!");

          // update DB rows for email_verified
          await updateVerificationStatus(result.user?.id);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setVerificationStatus("error");
        setMessage("حدث خطأ غير متوقع أثناء التفعيل");
      } finally {
        setLoading(false);
      }
    };

    const updateVerificationStatus = async (userId) => {
      try {
        const { data: restaurantData } = await supabase
          .from("restaurants")
          .select("id")
          .eq("id", userId)
          .single();

        if (restaurantData) {
          await supabase
            .from("restaurants")
            .update({
              email_verified: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        } else {
          await supabase
            .from("app_users")
            .update({
              email_verified: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        }
      } catch (error) {
        console.error("Error updating verification status:", error);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setLoading(false);
      setVerificationStatus("error");
      setMessage("رابط التفعيل غير صالح");
    }
  }, [token, type]);

  const resendVerification = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: user.email,
        });

        if (error) {
          setMessage("خطأ في إعادة إرسال رابط التفعيل: " + error.message);
        } else {
          setMessage("تم إرسال رابط التفعيل مرة أخرى إلى بريدك الإلكتروني");
        }
      }
    } catch (error) {
      setMessage("حدث خطأ أثناء إعادة الإرسال");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block mb-3">
            <span className="inline-block h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-500">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="shadow-lg p-5 rounded bg-white w-full max-w-md">
        <div className="text-center">
          {verificationStatus === "success" ? (
            <>
              <FaCheckCircle
                size={64}
                className="text-green-600 mb-3 mx-auto"
              />
              <h2 className="text-green-600 mb-3">تم التفعيل بنجاح!</h2>
              <p className="mb-4">{message}</p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/user/login"
                  className="bg-blue-600 text-white py-2 rounded text-center"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/"
                  className="border border-gray-300 py-2 rounded text-center"
                >
                  العودة للرئيسية
                </Link>
              </div>
            </>
          ) : (
            <>
              <FaTimesCircle size={64} className="text-red-600 mb-3 mx-auto" />
              <h2 className="text-red-600 mb-3">فشل التفعيل</h2>
              <p className="mb-4">{message}</p>

              <div className="bg-blue-50 text-blue-700 p-3 rounded mb-4 inline-block">
                <FaEnvelope className="inline-block mr-2" /> لم تستلم رابط
                التفعيل؟
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={resendVerification}
                  className="bg-yellow-400 py-2 rounded"
                >
                  إعادة إرسال رابط التفعيل
                </button>
                <Link
                  href="/user/login"
                  className="border border-gray-300 py-2 rounded text-center"
                >
                  صفحة تسجيل الدخول
                </Link>
                <Link
                  href="/user/register"
                  className="border border-gray-300 py-2 rounded text-center"
                >
                  إنشاء حساب جديد
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
