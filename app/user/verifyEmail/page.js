"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { FaCheckCircle, FaTimesCircle, FaEnvelope } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
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
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type || "signup",
        });

        if (error) {
          console.error("Error verifying email:", error);
          setVerificationStatus("error");

          if (error.message.includes("already verified")) {
            setMessage("البريد الإلكتروني مفعل بالفعل");
          } else if (error.message.includes("expired")) {
            setMessage("رابط التفعيل منتهي الصلاحية");
          } else {
            setMessage("فشل في تفعيل البريد الإلكتروني: " + error.message);
          }
        } else {
          setVerificationStatus("success");
          setMessage("تم تفعيل بريدك الإلكتروني بنجاح!");

          await updateVerificationStatus(data.user.id);
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
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="text-muted">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow-lg p-5"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-body text-center">
          {verificationStatus === "success" ? (
            <>
              <FaCheckCircle size={64} className="text-success mb-3" />
              <h2 className="card-title text-success mb-3">
                تم التفعيل بنجاح!
              </h2>
              <p className="card-text mb-4">{message}</p>
              <div className="d-grid gap-2">
                <Link href="/user/login" className="btn btn-primary">
                  تسجيل الدخول
                </Link>
                <Link href="/" className="btn btn-outline-secondary">
                  العودة للرئيسية
                </Link>
              </div>
            </>
          ) : (
            <>
              <FaTimesCircle size={64} className="text-danger mb-3" />
              <h2 className="card-title text-danger mb-3">فشل التفعيل</h2>
              <p className="card-text mb-4">{message}</p>

              <div className="alert alert-info mb-4">
                <FaEnvelope className="me-2" />
                لم تستلم رابط التفعيل؟
              </div>

              <div className="d-grid gap-2">
                <button
                  onClick={resendVerification}
                  className="btn btn-warning"
                >
                  إعادة إرسال رابط التفعيل
                </button>
                <Link href="/user/login" className="btn btn-outline-primary">
                  صفحة تسجيل الدخول
                </Link>
                <Link
                  href="/user/register"
                  className="btn btn-outline-secondary"
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
