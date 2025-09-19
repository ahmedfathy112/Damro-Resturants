"use client";
import React, { useEffect, useState } from "react";
import "./ResturentStyle.css";
import { FaStar, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdPlaylistAddCheck } from "react-icons/md";
import { IoMdBicycle } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";

const ResturentDatails = ({ restaurantId }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!restaurantId) return;

      try {
        // جلب بيانات المطعم
        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("id", restaurantId)
          .single();

        if (restaurantError) throw restaurantError;

        // جلب التقييمات لحساب المتوسط
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("rating")
          .eq("restaurant_id", restaurantId);

        if (reviewsError) throw reviewsError;

        // حساب متوسط التقييم
        const ratings = reviewsData?.map((review) => review.rating) || [];
        const avgRating =
          ratings.length > 0
            ? (
                ratings.reduce((sum, rating) => sum + rating, 0) /
                ratings.length
              ).toFixed(1)
            : 0;

        setRestaurant(restaurantData);
        setAverageRating(parseFloat(avgRating));
        setTotalReviews(ratings.length);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  // دالة لعرض النجوم حسب التقييم
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} style={{ color: "gold" }} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} style={{ color: "gold" }} />);
      } else {
        stars.push(<FaStar key={i} style={{ color: "#ccc" }} />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="resturentdetails">
        <div className="overlay"></div>
        <div className="restop d-flex flex-column flex-md-row align-items-center h-100 p-3 gap-4 justify-content-center">
          <div className="text-white text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3">جاري تحميل بيانات المطعم...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="resturentdetails">
        <div className="overlay"></div>
        <div className="restop d-flex flex-column flex-md-row align-items-center h-100 p-3 gap-4 justify-content-center">
          <div className="text-white text-center">
            <h2>المطعم غير موجود</h2>
            <p>عذراً، لم يتم العثور على بيانات المطعم</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resturentdetails">
      <div className="overlay"></div>

      <div className="restop d-flex flex-column flex-md-row align-items-center h-100 p-3 gap-4">
        <div className="ResturentdetailsText text-white text-end text-md-end">
          <h2>مرحباً بك في</h2>
          <br />
          <h1>{restaurant.name || "اسم المطعم"}</h1>

          {/* contact details */}
          <div className="restaurant-info mt-4">
            {restaurant.address && (
              <div className="d-flex align-items-center justify-content-end mb-2">
                <FaMapMarkerAlt className="me-2" />
                <span>{restaurant.address}</span>
              </div>
            )}

            {restaurant.phone && (
              <div className="d-flex align-items-center justify-content-end mb-2">
                <FaPhone className="me-2" />
                <span>{restaurant.phone}</span>
              </div>
            )}
          </div>

          <div className="d-flex flex-column flex-sm-row gap-3 mt-5">
            <button className="d-flex align-items-center gap-3 btn btn-outline-light p-3">
              <MdPlaylistAddCheck style={{ fontSize: "24px" }} />
              <span className="fs-6">الحد الأدنى للطلب: 30 جنيه</span>
            </button>

            <button className="d-flex align-items-center gap-3 btn btn-outline-light p-3">
              <IoMdBicycle style={{ fontSize: "24px" }} />
              <span className="fs-6">وقت التوصيل: 30-45 دقيقة</span>
            </button>
          </div>
        </div>

        <div className="Resimage bg-white p-3 rounded shadow position-relative">
          {restaurant.image_url ? (
            <Image
              src={restaurant.image_url}
              alt={restaurant.name}
              width={200}
              height={200}
              className="img-fluid rounded"
              style={{ objectFit: "cover", width: "200px", height: "200px" }}
            />
          ) : (
            <img
              src="/Images/ResDeHome.png"
              alt="صورة تفاصيل المطعم"
              className="img-fluid rounded"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          )}

          <div className="rating-box">
            <h4 className="mb-1">{averageRating}</h4>
            <div className="d-flex justify-content-center gap-1">
              {renderStars(averageRating)}
            </div>
            <p className="mt-1 mb-0" style={{ fontSize: "12px" }}>
              {totalReviews} تقييم
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResturentDatails;
