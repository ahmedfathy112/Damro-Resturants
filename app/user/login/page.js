"use client";
import Link from "next/link";
import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Loader2 } from "lucide-react";

const LoginPages = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter email and password",
      });
      setLoading(false);
      return;
    }
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (response.error) {
        setError(response.error.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "حدث خطا ما أثناء تسجيل الدخول من فضلك حاول مره أخري لاحقا!",
        });
        setLoading(false);
        return;
      }

      // set the token to the localStorage and redirect to home page
      if (response.data.session) {
        localStorage.setItem(
          "access_token",
          response.data.session.access_token
        );
        router.push("/");
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `/pages/userDashboard`,
        },
      });

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "حدث خطا ما أثناء تسجيل الدخول من فضلك حاول مره أخري لاحقا!",
        });
        setError(error.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "حدث خطا ما أثناء تسجيل الدخول من فضلك حاول مره أخري لاحقا!",
      });
      setLoading(false);
    }
  };
  return (
    <div className="login" dir="rtl">
      {/* warning */}
      <h3 className="font-bold text-center mt-4 text-white py-3 px-4 text-[18px] bg-black">
        ملحوظه : تسجيل الدخول او إنشاء الحساب بأستخدام جوجل هو متاح للعملاء فقط
        وليس للمطاعم نرجو من المطاعم ان يقومو بإنشاء حساب لهم من صفحة إنشاء
        وللعلم ايضا انه بعد انشاء المطعم للحساب الخاص به سيتم مراجعته والتاكد من
        هويته لذلك يرجي وضع بيانات صحيحه الحساب
      </h3>

      <div className="py-5 min-h-screen flex items-center justify-center px-4 ">
        <div className="w-full flex flex-wrap items-center justify-center">
          <div className="w-full lg:w-5/12 md:w-1/2 mb-4 px-4">
            <h3 className="mb-3 font-bold font-serif">تسجيل الدخول</h3>

            <form onSubmit={handleLogin} className="mb-3">
              <div className="mb-3">
                <label htmlFor="email" className="block font-semibold mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border rounded px-3 py-2"
                  placeholder="أدخل البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="block font-semibold mb-1">
                  كلمة المرور
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full border rounded px-3 py-2 relative"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="fixed right-2 top-1/2 -translate-y-1/2 bg-transparent border-0"
                  style={{ zIndex: 10 }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-black flex flex-row items-center justify-center gap-2 text-white py-2 rounded text-sm font-semibold hover:bg-gray-900 transition-colors duration-200"
                disabled={loading}
              >
                تسجيل الدخول
                {loading && (
                  <span className="animate-spin ml-2">
                    <Loader2 size={20} />
                  </span>
                )}
              </button>
            </form>

            <Link
              href="/user/register"
              className="flex items-center justify-between px-3 py-2 translate-y-6 max-w-lg mx-auto"
              style={{ borderBottom: "1px solid #ccc" }}
            >
              <Link href="/user/register" className="text-gray-800">
                <IoMdArrowRoundBack size={20} />
              </Link>
              <Link
                href="/user/register"
                style={{ textDecoration: "none", fontSize: "14px" }}
                className="text-gray-800"
              >
                إنشاء حساب جديد
              </Link>
            </Link>
          </div>

          <div className="hidden lg:flex lg:w-2/12 justify-center mb-3">
            <div className="flex flex-col items-center">
              <div
                style={{ width: "1px", height: "90px", background: "#ccc" }}
              />
              <p className="my-2">Or</p>
              <div
                style={{ width: "1px", height: "90px", background: "#ccc" }}
              />
            </div>
          </div>

          <div className="w-full lg:w-5/12 md:w-1/2 flex flex-col gap-3 mt-2 px-4">
            <p className="text-center lg:hidden">او أستخدام</p>
            {/* google login button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="border border-gray-800 text-gray-800 flex items-center gap-2 justify-center py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
            >
              <FcGoogle size={22} /> تسجيل الدخول بأستخدام جوجل
              {loading && (
                <span className="animate-spin">
                  {" "}
                  <Loader2 size={20} />
                </span>
              )}
            </button>
            <button
              disabled
              className="border border-blue-600 text-blue-600 flex items-center gap-2 justify-center py-2 rounded text-sm font-medium hover:bg-blue-50 transition-colors duration-200 opacity-50 cursor-not-allowed"
            >
              <FaFacebook size={22} /> تسجيل الدخول بأستخدام فيسبوك
            </button>
            <p className="text-center text-sm text-gray-600">
              سيتم اتاحة فيسبوك قريبا
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPages;
