"use client";
import React, { useEffect, useState } from "react";
import "./ResturentStyle.css";
import { FaStar, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdPlaylistAddCheck } from "react-icons/md";
import { IoMdBicycle } from "react-icons/io";

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
        // fetch restaurant details
        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("id", restaurantId)
          .single();

        if (restaurantError) throw restaurantError;

        // fetch reviews to calculate average rating
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("rating")
          .eq("restaurant_id", restaurantId);

        if (reviewsError) throw reviewsError;

        // calculate average rating
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
        <div className="restop flex flex-col md:flex-row items-center h-full p-3 gap-4 justify-center">
          <div className="text-white text-center">
            <div className="flex justify-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
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
        <div className="restop flex flex-col md:flex-row items-center h-full p-3 gap-4 justify-center">
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

      <div className="restop flex flex-col md:flex-row items-center h-full p-3 gap-4">
        <div className="ResturentdetailsText text-white text-right md:text-right">
          <h2 className="text-base sm:text-lg font-semibold">مرحباً بك في</h2>
          <br />
          <h1 className="font-vintage text-4xl sm:text-5xl md:text-6xl max-md:text-5xl">
            {restaurant.name || "اسم المطعم"}
          </h1>

          {/* contact details */}
          <div className="restaurant-info mt-4">
            {restaurant.address && (
              <div className="flex items-center justify-end mb-2">
                <FaMapMarkerAlt className="me-2" />
                <span>{restaurant.address}</span>
              </div>
            )}

            {restaurant.phone && (
              <div className="flex items-center justify-end mb-2">
                <FaPhone className="me-2" />
                <span>
                  <a href={`tel:${restaurant.phone}`} className="text-white">
                    {restaurant.phone}
                  </a>
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button className="flex items-center gap-3 border border-white text-white p-3 rounded hover:bg-white hover:text-black transition-colors">
              <MdPlaylistAddCheck style={{ fontSize: "24px" }} />
              <span className="text-sm">الحد الأدنى للطلب: 30 جنيه</span>
            </button>

            <button className="flex items-center gap-3 border border-white text-white p-3 rounded hover:bg-white hover:text-black transition-colors">
              <IoMdBicycle style={{ fontSize: "24px" }} />
              <span className="text-sm">وقت التوصيل: 30-45 دقيقة</span>
            </button>
          </div>
        </div>

        <div className="Resimage bg-white p-3 rounded shadow relative">
          {restaurant.image_url ? (
            <Image
              src={restaurant.image_url}
              alt={restaurant.name}
              width={200}
              height={200}
              className="rounded"
              style={{ objectFit: "cover", width: "200px", height: "200px" }}
            />
          ) : (
            <Image
              src="/images/ResDeHome.webp"
              alt="صورة تفاصيل المطعم"
              width={200}
              height={200}
              className="rounded"
              style={{ objectFit: "cover", width: "200px", height: "200px" }}
            />
          )}

          <div className="rating-box">
            <h4 className="mb-1">{averageRating}</h4>
            <div className="flex justify-center gap-1">
              {renderStars(averageRating)}
            </div>
            <p className="mt-1 mb-0 text-xs">{totalReviews} تقييم</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResturentDatails;
