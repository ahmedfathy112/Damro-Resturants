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
    address: "",
    restaurant_name: "",
    description: "",
    restaurant_address: "",
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

    if (formData.user_type === "restaurant") {
      if (!formData.restaurant_name.trim()) {
        newErrors.restaurant_name = "اسم المطعم مطلوب";
      }
      if (!formData.restaurant_address.trim()) {
        newErrors.restaurant_address = "عنوان المطعم مطلوب";
      }
    } else {
      if (!formData.address.trim()) {
        newErrors.address = "العنوان مطلوب";
      }
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
      // define user metadata
      let userMetadata = {
        full_name: formData.full_name,
        user_type: formData.user_type,
        phone: formData.phone,
      };

      // add restaurant name for restaurant
      if (formData.user_type === "restaurant") {
        userMetadata.restaurant_name = formData.restaurant_name;
        userMetadata.restaurant_address = formData.restaurant_address;
        userMetadata.description = formData.description;
      }
      // add address for customer
      else if (formData.user_type === "customer") {
        userMetadata.address = formData.address;
      }

      // create user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: userMetadata,
          emailRedirectTo: "/pages/login",
        },
      });

      if (error) {
        setErrors({ submit: error.message });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // make sure the user is added to the correct table
      if (formData.user_type === "restaurant") {
        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (restaurantError || !restaurantData) {
          // add the restaurant to the restaurants table
          await supabase.from("restaurants").insert([
            {
              id: data.user.id,
              name: formData.restaurant_name,
              email: formData.email,
              phone: formData.phone,
              description: formData.description,
              address: formData.restaurant_address,
            },
          ]);
        } else {
          // if the restaurant already exists update his data
          await supabase
            .from("restaurants")
            .update({
              description: formData.description,
              address: formData.restaurant_address,
            })
            .eq("id", data.user.id);
        }
      } else {
        const { data: userData, error: userError } = await supabase
          .from("app_users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (userError || !userData) {
          // add the user to the app_users table
          await supabase.from("app_users").insert([
            {
              id: data.user.id,
              full_name: formData.full_name,
              phone: formData.phone,
              address: formData.address,
            },
          ]);
        } else {
          // if the user already exists update his data
          await supabase
            .from("app_users")
            .update({
              address: formData.address,
            })
            .eq("id", data.user.id);
        }
      }

      // success message
      Swal.fire({
        title: `تم إنشاء حسابك بنجاح! ${
          formData.user_type === "restaurant"
            ? "سيتم مراجعة حسابك من قبل الإدارة قريباً."
            : "تحقق من بريدك الإلكتروني لتفعيل الحساب."
        }`,
        icon: "success",
        draggable: true,
      });

      // redirect to login
      router.push("/user/login");
    } catch (error) {
      setErrors({ submit: "حدث خطأ غير متوقع: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register my-10 flex items-center"
      style={{
        minHeight: "100vh",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center shadow-lg rounded overflow-hidden bg-white">
          {/* Left Side - Form */}
          <div className="w-full lg:w-7/12 md:w-1/2 p-5">
            <div className="text-center mb-4">
              <h1 className="mb-3 font-bold text-gray-800">إنشاء حساب جديد</h1>
              <p className="text-gray-500">
                انضم إلى عائلة الطعام 🍴 واستمتع بأفضل الأطباق والتوصيل السريع!
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit}>
              {/* نوع الحساب */}
              <div className="mb-4">
                <label className="block font-semibold mb-3">نوع الحساب</label>
                {/* here the user choose if he`s a user or resturant */}
                <div className="flex flex-wrap flex-row gap-2">
                  <div className="w-[45%]">
                    <div
                      className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                        formData.user_type === "customer"
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 text-gray-600"
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
                  <div className="w-1/2">
                    <div
                      className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                        formData.user_type === "restaurant"
                          ? "border-green-500 bg-green-50 text-green-600"
                          : "border-gray-300 text-gray-600"
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

              {/* in case he is user */}
              {/* Full name */}
              <div className="mb-3">
                <label htmlFor="full_name" className="block font-semibold mb-1">
                  الاسم الكامل{" "}
                  {formData.user_type === "restaurant" && "/ اسم المطعم"}
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  className={`w-full border rounded px-3 py-2 ${
                    errors.full_name ? "border-red-500" : ""
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
                  <div className="text-red-600 text-sm mt-1">
                    {errors.full_name}
                  </div>
                )}
              </div>

              {/* full name for restaurant */}
              {formData.user_type === "restaurant" && (
                <div className="mb-3">
                  <label
                    htmlFor="restaurant_name"
                    className="form-label fw-semibold"
                  >
                    اسم المطعم
                  </label>
                  <input
                    type="text"
                    id="restaurant_name"
                    name="restaurant_name"
                    className={`w-full border rounded px-3 py-2 ${
                      errors.restaurant_name ? "border-red-500" : ""
                    }`}
                    placeholder="أدخل اسم المطعم"
                    value={formData.restaurant_name}
                    onChange={handleInputChange}
                  />
                  {errors.restaurant_name && (
                    <div className="text-red-600 text-sm">
                      {errors.restaurant_name}
                    </div>
                  )}
                </div>
              )}

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="block font-semibold mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full border rounded px-3 py-2 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <div className="text-red-600 text-sm">{errors.email}</div>
                )}
              </div>

              {/* Phone Num  */}
              <div className="mb-3">
                <label htmlFor="phone" className="block font-semibold mb-1">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`w-full border rounded px-3 py-2 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  placeholder="أدخل رقم هاتفك"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <div className="text-red-600 text-sm">{errors.phone}</div>
                )}
              </div>

              {/* address */}
              {formData.user_type === "customer" ? (
                <div className="mb-3">
                  <label htmlFor="address" className="form-label fw-semibold">
                    عنوان المنزل
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className={`w-full border rounded px-3 py-2 ${
                      errors.address ? "border-red-500" : ""
                    }`}
                    placeholder="أدخل عنوان منزلك"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  {errors.address && (
                    <div className="text-red-600 text-sm">{errors.address}</div>
                  )}
                </div>
              ) : (
                // in case the user is a restaurant
                <div className="mb-3">
                  <label
                    htmlFor="restaurant_address"
                    className="form-label fw-semibold"
                  >
                    عنوان المطعم
                  </label>
                  <input
                    type="text"
                    id="restaurant_address"
                    name="restaurant_address"
                    className={`w-full border rounded px-3 py-2 ${
                      errors.restaurant_address ? "border-red-500" : ""
                    }`}
                    placeholder="أدخل عنوان المطعم"
                    value={formData.restaurant_address}
                    onChange={handleInputChange}
                  />
                  {errors.restaurant_address && (
                    <div className="text-red-600 text-sm">
                      {errors.restaurant_address}
                    </div>
                  )}
                </div>
              )}

              {/* description for the restaurant */}
              {formData.user_type === "restaurant" && (
                <div className="mb-3">
                  <label
                    htmlFor="description"
                    className="form-label fw-semibold"
                  >
                    وصف المطعم
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full border rounded px-3 py-2"
                    placeholder="أدخل وصفًا مختصرًا للمطعم"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`w-full border rounded px-3 py-2 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="أدخل كلمة المرور"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-0"
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

              {/* Confirm Password */}
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="form-label fw-semibold"
                >
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`w-full border rounded px-3 py-2 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-0"
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

              {/* Error Message  */}
              {errors.submit && (
                <div
                  className="bg-red-100 text-red-800 p-3 rounded mb-3"
                  role="alert"
                >
                  {errors.submit}
                </div>
              )}

              {/* Alert for the restaurant */}
              {formData.user_type === "restaurant" && (
                <div
                  className="bg-blue-100 text-blue-800 p-3 rounded mb-4"
                  role="alert"
                >
                  <strong>ملاحظة:</strong> حسابات المطاعم تخضع لمراجعة الإدارة
                  قبل التفعيل
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white mb-3 py-3 font-semibold rounded text-base hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="inline-block mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  "إنشاء حساب جديد"
                )}
              </button>

              {/* رابط تسجيل الدخول */}
              <p className="text-center text-gray-600 mb-0 text-sm">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/user/login"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side - Info */}
          <div
            className="w-full lg:w-5/12 md:w-1/2 text-center flex flex-col justify-center p-5"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
          >
            <img
              src="/images/register.png"
              alt="تسجيل جديد"
              className="mb-4 max-h-60 mx-auto"
              style={{ maxHeight: "240px" }}
            />

            <h4 className="mb-4 fw-bold text-white">لماذا تنضم إلينا؟</h4>
            <ul className="list-none text-start inline-block text-white text-base">
              <li className="mb-3 flex items-center gap-3">
                <FaUtensils className="text-yellow-400" />
                <span>الوصول الي جميع المطاعم في مكان واحد</span>
              </li>
              <li className="mb-3 flex items-center gap-3">
                <FaPizzaSlice className="text-sky-400" />
                <span>سهوله الاستخدام</span>
              </li>
              <li className="mb-3 flex items-center gap-3">
                <FaFish className="text-green-400" />
                <span>عروض وخصومات</span>
              </li>
              <li className="mb-3 flex items-center gap-3">
                <FaLeaf className="text-white" />
                <span>كل هذا بين يديك انت في مكان واحد</span>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-white/20 rounded">
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
