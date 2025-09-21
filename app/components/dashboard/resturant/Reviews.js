"use client";
import React, { useState, useEffect } from "react";
import { Star, Search, Filter, Calendar, User } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { useParams } from "next/navigation";
import { useAuth } from "../../../context/Authcontext";

const Reviews = (restaurantId) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [restaurant, setRestaurant] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      fetchRestaurantDetails();
      fetchReviews();
    }
  }, [userId]);

  useEffect(() => {
    filterAndSortReviews();
  }, [reviews, searchTerm, ratingFilter, sortBy]);

  const fetchRestaurantDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("name, image_url")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setRestaurant(data);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          *,
          app_users (
            full_name,
            email
          )
        `
        )
        .eq("restaurant_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const processedReviews = data.map((review) => ({
        ...review,
        user_name:
          review.app_users?.full_name ||
          review.app_users?.email?.split("@")[0] ||
          "مستخدم",
      }));

      setReviews(processedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReviews = () => {
    let filtered = reviews.filter((review) => {
      // التصفية حسب البحث
      const matchesSearch =
        searchTerm === "" ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user_name.toLowerCase().includes(searchTerm.toLowerCase());

      // التصفية حسب التقييم
      const matchesRating =
        ratingFilter === "all" || review.rating === parseInt(ratingFilter);

      return matchesSearch && matchesRating;
    });

    // الترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  };

  // حساب الإحصائيات
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        ).toFixed(1)
      : 0;

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* العنوان الرئيسي */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {restaurant?.image_url && (
              <img
                src={restaurant.image_url}
                alt={restaurant.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                تقييمات {restaurant?.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {averageRating}
                </span>
                <span className="text-gray-600">({totalReviews} تقييم)</span>
              </div>
            </div>
          </div>
        </div>

        {/* الإحصائيات والتوزيع */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">توزيع التقييمات</h3>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div
                key={rating}
                className="flex items-center justify-between mb-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{rating} نجوم</span>
                  <div className="flex items-center gap-1">
                    {renderStars(rating)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {ratingDistribution[rating]}
                  </span>
                  <span className="text-sm text-gray-600">
                    (
                    {totalReviews > 0
                      ? Math.round(
                          (ratingDistribution[rating] / totalReviews) * 100
                        )
                      : 0}
                    %)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* موجز التقييمات */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">ملخص التقييمات</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">إجمالي التقييمات</span>
                <span className="font-semibold">{totalReviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">متوسط التقييم</span>
                <span className="font-semibold">{averageRating} من 5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  التقييمات الإيجابية (4-5 نجوم)
                </span>
                <span className="font-semibold">
                  {ratingDistribution[5] + ratingDistribution[4]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* أدوات التصفية والبحث */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="ابحث في التعليقات أو أسماء المستخدمين..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">جميع التقييمات</option>
              <option value="5">5 نجوم</option>
              <option value="4">4 نجوم</option>
              <option value="3">3 نجوم</option>
              <option value="2">2 نجوم</option>
              <option value="1">1 نجمة</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="highest">الأعلى تقييماً</option>
              <option value="lowest">الأقل تقييماً</option>
            </select>
          </div>
        </div>

        {/* قائمة التقييمات */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500 text-lg">
                {searchTerm || ratingFilter !== "all"
                  ? "لا توجد تقييمات تطابق معايير البحث"
                  : "لا توجد تقييمات حتى الآن"}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.user_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {review.rating} من 5
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                </div>

                {review.comment && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-3">
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* التذييل */}
        {filteredReviews.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>
              عرض {filteredReviews.length} من أصل {totalReviews} تقييم
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
