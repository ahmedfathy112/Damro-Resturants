"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  FaUtensils,
  FaPizzaSlice,
  FaFish,
  FaLeaf,
  FaUser,
  FaStore,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "../../lib/supabaseClient";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    user_type: "customer",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Check data before submit
  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "الاسم الكامل مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمة المرور غير متطابقة";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    }

    return newErrors;
  };

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            user_type: formData.user_type,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        setErrors({ submit: error.message });
        return;
      }

      // Success Message
      Swal.fire({
        title: `تم إنشاء حسابك بنجاح! ${
          formData.user_type === "restaurant"
            ? "سيتم مراجعة حسابك من قبل الإدارة قريباً."
            : "تحقق من بريدك الإلكتروني لتفعيل الحساب."
        }`,
        icon: "success",
        draggable: true,
      });

      // route the user to login page
      router.push("/user/login");
    } catch (error) {
      setErrors({ submit: "حدث خطأ غير متوقع" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register my-10 d-flex align-items-center"
      style={{
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div className="row align-items-center shadow-lg rounded-3 overflow-hidden bg-white">
          {/* Left Side - Form */}
          <div className="col-lg-7 col-md-6 p-5">
            <div className="text-center mb-4">
              <h1 className="mb-3 fw-bold text-dark">إنشاء حساب جديد</h1>
              <p className="text-muted">
                انضم إلى عائلة الطعام 🍴 واستمتع بأفضل الأطباق والتوصيل السريع!
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit}>
              {/* نوع الحساب */}
              <div className="mb-4">
                <label className="form-label fw-semibold mb-3">
                  نوع الحساب
                </label>
                {/* here the user choose if he`s a user or resturant */}
                <div className="row g-3">
                  <div className="col-6">
                    <div
                      className={`p-3 border rounded-3 text-center cursor-pointer transition-all ${
                        formData.user_type === "customer"
                          ? "border-primary bg-primary bg-opacity-10 text-primary"
                          : "border-secondary text-muted hover-shadow"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          user_type: "customer",
                        }))
                      }
                    >
                      <FaUser size={30} className="mb-2" />
                      <div className="fw-semibold">عميل</div>
                      <small>طلب الطعام والتوصيل</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className={`p-3 border rounded-3 text-center cursor-pointer transition-all ${
                        formData.user_type === "restaurant"
                          ? "border-success bg-success bg-opacity-10 text-success"
                          : "border-secondary text-muted hover-shadow"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          user_type: "restaurant",
                        }))
                      }
                    >
                      <FaStore size={30} className="mb-2" />
                      <div className="fw-semibold">مطعم</div>
                      <small>بيع الطعام وإدارة الطلبات</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* الاسم الكامل */}
              <div className="mb-3">
                <label htmlFor="full_name" className="form-label fw-semibold">
                  الاسم الكامل{" "}
                  {formData.user_type === "restaurant" && "/ اسم المطعم"}
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  className={`form-control ${
                    errors.full_name ? "is-invalid" : ""
                  }`}
                  placeholder={
                    formData.user_type === "restaurant"
                      ? "أدخل اسم المطعم"
                      : "أدخل اسمك الكامل"
                  }
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
                {errors.full_name && (
                  <div className="invalid-feedback">{errors.full_name}</div>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* رقم الهاتف - للمطاعم فقط */}

              <div className="mb-3">
                <label htmlFor="phone" className="form-label fw-semibold">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="أدخل رقم هاتف المطعم"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>

              {/* كلمة المرور */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  كلمة المرور
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="أدخل كلمة المرور"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="btn position-absolute end-0 top-50 translate-middle-y border-0"
                    style={{ zIndex: 10 }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              {/* تأكيد كلمة المرور */}
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="form-label fw-semibold"
                >
                  تأكيد كلمة المرور
                </label>
                <div className="position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="btn position-absolute end-0 top-50 translate-middle-y border-0"
                    style={{ zIndex: 10 }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* رسالة الخطأ العامة */}
              {errors.submit && (
                <div className="alert alert-danger mb-3" role="alert">
                  {errors.submit}
                </div>
              )}

              {/* تنبيه للمطاعم */}
              {formData.user_type === "restaurant" && (
                <div className="alert alert-info mb-4" role="alert">
                  <strong>ملاحظة:</strong> حسابات المطاعم تخضع لمراجعة الإدارة
                  قبل التفعيل
                </div>
              )}

              {/* زر الإرسال */}
              <button
                type="submit"
                className="btn btn-primary w-100 mb-3 py-3 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  "إنشاء حساب جديد"
                )}
              </button>

              {/* رابط تسجيل الدخول */}
              <p className="text-center text-muted mb-0">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/login"
                  className="text-decoration-none fw-semibold text-primary"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side - Info */}
          <div
            className="col-lg-5 col-md-6 text-center d-flex flex-column justify-content-center p-5"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
          >
            <img
              src="/Images/register.png"
              alt="تسجيل جديد"
              className="img-fluid mb-4"
              style={{ maxHeight: "240px" }}
            />

            <h4 className="mb-4 fw-bold text-white">لماذا تنضم إلينا؟</h4>
            <ul className="list-unstyled text-start d-inline-block fs-6 text-white">
              <li className="mb-3 d-flex align-items-center gap-3">
                <FaUtensils className="text-warning fs-5" />
                <span>الوصول إلى مئات المطاعم</span>
              </li>
              <li className="mb-3 d-flex align-items-center gap-3">
                <FaPizzaSlice className="text-info fs-5" />
                <span>عروض حصرية يومية</span>
              </li>
              <li className="mb-3 d-flex align-items-center gap-3">
                <FaFish className="text-success fs-5" />
                <span>أطباق بحرية طازجة</span>
              </li>
              <li className="mb-3 d-flex align-items-center gap-3">
                <FaLeaf className="text-light fs-5" />
                <span>خيارات صحية ونباتية</span>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-3">
              <small className="text-black">
                🚀 <strong>توصيل سريع</strong> في أقل من 30 دقيقة
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
