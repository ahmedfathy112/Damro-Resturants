"use client";
import { Rating } from "@mui/material";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/Authcontext";

const CommentSec = ({ restaurantId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // استخدام الخصائص المتاحة من useAuth
  const {
    isAuthenticated,
    isCustomer,
    isRestaurant,
    userId,
    user: authUser,
  } = useAuth();

  useEffect(() => {
    fetchComments();
    if (isAuthenticated && authUser) {
      setUser(authUser);
    }
  }, [restaurantId, isAuthenticated, authUser]);

  const fetchComments = async () => {
    try {
      // الاستعلام الصحيح بدون raw_user_meta_data
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
        *,
        app_users:user_id (
          full_name, email
        )
      `
        )
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // معالجة البيانات لاستخدام الاسم من المصدر المناسب
      const processedComments = data.map((comment) => ({
        ...comment,
        user_name:
          comment.app_users?.full_name ||
          comment.app_users?.email?.split("@")[0] ||
          "مستخدم",
      }));

      setComments(processedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("يجب تسجيل الدخول أولاً");
      return;
    }

    if (isRestaurant) {
      alert("المطاعم لا يمكنها إضافة تعليقات");
      return;
    }

    if (!isCustomer) {
      alert("فقط العملاء يمكنهم إضافة تعليقات");
      return;
    }

    if (rating === 0) {
      alert("يرجى إضافة تقييم");
      return;
    }

    if (!newComment.trim()) {
      alert("يرجى كتابة تعليق");
      return;
    }

    setLoading(true);

    try {
      // التحقق أولاً من وجود المستخدم في جدول app_users
      const { data: userData, error: userError } = await supabase
        .from("app_users")
        .select("id")
        .eq("id", userId)
        .single();

      // إذا لم يوجد المستخدم في app_users، قم بإضافته
      if (userError || !userData) {
        console.log("المستخدم غير موجود في app_users، جاري إضافه...");

        const { error: insertError } = await supabase.from("app_users").insert([
          {
            id: userId,
            full_name:
              authUser?.user_metadata?.full_name ||
              authUser?.email?.split("@")[0] ||
              "مستخدم",
            email: authUser?.email,
            phone: authUser?.user_metadata?.phone || "",
            address: authUser?.user_metadata?.address || "",
            created_at: new Date().toISOString(),
          },
        ]);

        if (insertError) {
          console.error("Error adding user to app_users:", insertError);
          throw new Error("فشل في إنشاء حساب المستخدم");
        }
      }

      // التحقق من عدم وجود تقييم سابق
      const { data: existingReview, error: checkError } = await supabase
        .from("reviews")
        .select("id")
        .eq("user_id", userId)
        .eq("restaurant_id", restaurantId)
        .maybeSingle();

      if (existingReview && !checkError) {
        throw new Error("لقد قمت بالتقييم مسبقاً لهذا المطعم");
      }

      // إضافة التقييم
      const { error } = await supabase.from("reviews").insert([
        {
          user_id: userId,
          restaurant_id: restaurantId,
          rating: rating,
          comment: newComment.trim(),
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // إعادة تعيين الحقول
      setNewComment("");
      setRating(0);

      // إعادة تحميل التعليقات
      fetchComments();

      alert("تم إضافة التعليق بنجاح!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert(error.message || "حدث خطأ أثناء إضافة التعليق");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // حساب متوسط التقييم
  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((sum, comment) => sum + comment.rating, 0) /
          comments.length
        ).toFixed(1)
      : 0;

  return (
    <div className="flex flex-col gap-3 my-4 px-4" dir="rtl">
      <h1 className="!text-3xl !my-4 !font-semibold">التعليقات والتقييمات</h1>

      {/* متوسط التقييم */}
      {comments.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-yellow-600">
              {averageRating}
            </span>
            <Rating
              value={parseFloat(averageRating)}
              precision={0.1}
              readOnly
            />
            <span className="text-gray-600">({comments.length} تقييم)</span>
          </div>
        </div>
      )}

      {/* نموذج إضافة تعليق - يظهر فقط للعملاء */}
      {isAuthenticated && isCustomer && (
        <div className="!my-4 bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">أضف تعليقك</h3>
          <form onSubmit={handleSubmitComment}>
            <textarea
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              rows="4"
              placeholder="اكتب تعليقك هنا..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loading}
            ></textarea>

            <div
              className="flex flex-row-reverse items-center justify-between mt-2"
              dir="ltr"
            >
              <p className="text-lg">قيم المطعم</p>
              <Rating
                name="half-rating"
                value={rating}
                precision={0.5}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-yellow-500 text-white !rounded-xl hover:bg-yellow-600 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "إرسال التعليق"}
            </button>
          </form>
        </div>
      )}

      {/* رسالة للمطاعم */}
      {isAuthenticated && isRestaurant && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-blue-800">
            ⚠️ المطاعم لا يمكنها إضافة تعليقات على المطاعم الأخرى
          </p>
        </div>
      )}

      {/* رسالة للزوار غير المسجلين */}
      {!isAuthenticated && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-gray-600">يجب تسجيل الدخول كعميل لإضافة تعليق</p>
        </div>
      )}

      {/* عرض جميع التعليقات */}
      <div className="flex flex-col gap-4 !my-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">لا توجد تعليقات حتى الآن</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col justify-end border-2 border-gray-300 rounded-2xl items-end !py-4 !px-3 bg-white"
            >
              {/* معلومات المستخدم */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-start w-full">
                  <h3 className="!text-xl !font-medium text-right">
                    {comment.app_users?.full_name || "مستخدم"}
                  </h3>
                  <Rating
                    name="half-rating"
                    value={comment.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                </div>

                {/* نص التعليق */}
                <div className="!my-2 w-full">
                  <p className="!text-lg !text-gray-700 !mt-2 !text-right">
                    {comment.comment}
                  </p>
                </div>

                {/* تاريخ التعليق */}
                <div className="text-gray-500 !text-sm !text-left w-full">
                  <p>{formatDate(comment.created_at)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSec;
