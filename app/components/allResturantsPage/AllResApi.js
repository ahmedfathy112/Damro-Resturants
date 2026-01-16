"use client";
import React, { useMemo, memo, useState } from "react";
import { FaStar, FaMapMarkerAlt, FaPhone, FaUtensils } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { GoSearch } from "react-icons/go";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/Authcontext";
import { useRestaurants } from "../../hooks/useRestaurants";

// Memoized Restaurant Card Component
const RestaurantCard = memo(({ restaurant, index }) => {
  const isAboveFold = index < 4; // First 4 cards are above the fold

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col justify-center items-center mb-8 px-3">
      <div
        className="bg-white rounded-2xl text-center w-full relative transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
        style={{
          paddingTop: "60px",
          paddingBottom: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          minHeight: "320px",
        }}
      >
        {/* restaurant Image */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-12 z-10"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "#2A2634",
            overflow: "hidden",
            border: "4px solid #fff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          {restaurant.image_url ? (
            <Image
              src={restaurant.image_url}
              alt={restaurant.name}
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
              loading={isAboveFold ? "eager" : "lazy"}
              priority={isAboveFold}
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-800">
              <FaUtensils className="text-amber-500" size={32} />
            </div>
          )}
        </div>

        <div className="px-4 py-2 pt-6">
          {/* restaurant name */}
          <h5 className="font-bold mb-3 text-lg min-h-[3rem] flex items-center justify-center">
            {restaurant.name}
          </h5>

          {/* reviews and num of dishes*/}
          <div className="flex flex-row justify-around items-center mb-4 px-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-amber-500 font-bold flex items-center gap-1 text-base">
                <FaStar className="text-amber-400" />
                {restaurant.average_rating || 0}
              </span>
              <small className="text-gray-500 text-xs">
                ({restaurant.total_reviews || 0} تقييم)
              </small>
            </div>

            {/* count of dishes */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-bold text-base">
                {restaurant.dish_count || 0}
              </span>
              <small className="text-gray-500 text-xs">الأطباق</small>
            </div>
          </div>

          {/* restaurant details*/}
          <div className="restaurant-info mb-3 space-y-2">
            {restaurant.address && (
              <div className="flex items-center justify-center mb-2">
                <FaMapMarkerAlt
                  className="text-red-600 me-2 flex-shrink-0"
                  size={14}
                />
                <small className="text-gray-600 text-sm truncate max-w-[200px]">
                  {restaurant.address.length > 25
                    ? `${restaurant.address.substring(0, 25)}...`
                    : restaurant.address}
                </small>
              </div>
            )}

            {/* Restaurant Phone */}
            {restaurant.phone && (
              <div className="flex items-center justify-center mb-2">
                <FaPhone
                  className="text-blue-600 me-2 flex-shrink-0"
                  size={14}
                />
                <small className="text-gray-600 text-sm">
                  {restaurant.phone}
                </small>
              </div>
            )}
          </div>

          {/* restaurant description */}
          {restaurant.description && (
            <p className="text-gray-500 text-xs mb-4 line-clamp-2 min-h-[2.5rem] px-2">
              {restaurant.description}
            </p>
          )}
        </div>

        {/* order now btn and favorite btn */}
        <div className="border-t border-gray-100 pt-3 px-4 pb-2 mt-auto">
          <div className="flex justify-center items-center gap-2">
            <Link
              href={`/pages/allResturants/${restaurant.id}`}
              className="py-2.5 px-4 bg-amber-600 text-white rounded-xl flex-grow text-center font-bold text-sm hover:bg-amber-700 transition-colors shadow-sm"
              prefetch={true}
            >
              أطلب الآن
            </Link>
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MdFavoriteBorder
                className="cursor-pointer text-2xl text-gray-600 hover:text-red-500 transition-colors"
                onClick={() => console.log("Add to favorites:", restaurant.id)}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

RestaurantCard.displayName = "RestaurantCard";

const AllResApi = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { userId } = useAuth();
  const {
    restaurants,
    isLoading: loading,
    error: fetchError,
  } = useRestaurants();

  // Memoize filtered restaurants to avoid unnecessary recalculations
  const filteredRestaurants = useMemo(() => {
    if (!searchTerm.trim()) {
      return restaurants;
    }
    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, restaurants]);

  const error = fetchError ? "حدث خطأ في تحميل المطاعم" : "";

  if (loading) {
    return (
      <div className="AllResApi container mx-auto py-5" dir="rtl">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
          <p className="mt-3 text-gray-600">جاري تحميل المطاعم...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="AllResApi container mx-auto py-5" dir="rtl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          {error}
          <button
            className="ml-3 px-3 py-1 text-sm border border-red-700 rounded hover:bg-red-50"
            onClick={() => window.location.reload()}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="AllResApi container mx-auto py-5" dir="rtl">
      <div className="w-full">
        <div className="w-full">
          <h1 className="font-vintage text-center mb-5 text-black text-3xl sm:text-4xl flex items-center justify-center gap-2">
            <FaUtensils className="text-amber-500" />
            المطاعم المتاحة
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-20 px-4">
        <div className="w-full flex flex-row justify-between mx-auto max-md:flex-col max-md:justify-center max-md:items-center gap-4">
          <h3 className="text-2xl max-md:mb-2">مطاعمنا</h3>
          <div className="flex items-center px-3 py-2 rounded border border-gray-300 bg-white">
            <GoSearch size={20} className="ms-2 text-gray-500" />
            <input
              type="text"
              className="border-0 p-0 ms-2 bg-transparent outline-none focus:ring-0 text-black placeholder-gray-400"
              placeholder="ابحث عن مطعم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row flex-wrap justify-center items-center gap-6 px-4">
        {/* check if there`s any resturants */}
        {filteredRestaurants.length === 0 ? (
          <div className="w-full text-center py-5">
            <FaUtensils size={64} className="text-gray-400 mb-3 mx-auto" />
            <h4 className="text-gray-400">
              {searchTerm
                ? "لم يتم العثور على مطاعم"
                : "لا توجد مطاعم متاحة حالياً"}
            </h4>
            <p className="text-gray-400">
              {searchTerm
                ? "جرب البحث باسم آخر أو تحقق من التهجئة"
                : "لم يتم إضافة أي مطاعم بعد أو أن المطاعم قيد المراجعة"}
            </p>
          </div>
        ) : (
          filteredRestaurants.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              index={index}
            />
          ))
        )}
      </div>

      {/* additinal styles */}
      <style jsx>{`
        .AllResApi {
          background: #fff;
          min-height: 100vh;
          color: #000;
        }
      `}</style>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(AllResApi);
