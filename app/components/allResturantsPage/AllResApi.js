"use client";
import React, { useEffect, useState } from "react";
import { FaStar, FaMapMarkerAlt, FaPhone, FaUtensils } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { GoSearch } from "react-icons/go";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/Authcontext";

const AllResApi = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { userId } = useAuth();

  const fetchDishCounts = async (restaurantIds) => {
    try {
      const countsMap = {};

      // get count of dishes for each restaurant
      for (const restaurantId of restaurantIds) {
        const { count, error } = await supabase
          .from("menu_items")
          .select("*", { count: "exact" })
          .eq("restaurant_id", restaurantId);

        if (error) {
          console.error(
            `Error fetching dishes for restaurant ${restaurantId}:`,
            error
          );
          countsMap[restaurantId] = 0;
        } else {
          countsMap[restaurantId] = count || 0;
        }
      }

      return countsMap;
    } catch (error) {
      console.error("Error fetching dish counts:", error);
      return {};
    }
  };

  // get ratings for each restaurant
  const fetchRestaurantRatings = async (restaurantIds) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("restaurant_id, rating")
        .in("restaurant_id", restaurantIds);

      if (error) throw error;

      // calculate ratings map
      const ratingsMap = {};
      restaurantIds.forEach((id) => {
        ratingsMap[id] = [];
      });

      data.forEach((review) => {
        if (ratingsMap[review.restaurant_id]) {
          ratingsMap[review.restaurant_id].push(review.rating);
        }
      });

      return ratingsMap;
    } catch (error) {
      console.error("Error fetching ratings:", error);
      return {};
    }
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        // get all restaurants
        const { data, error: fetchError } = await supabase
          .from("restaurants")
          .select(`*`)
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        // get restaurant IDs
        const restaurantIds = data.map((restaurant) => restaurant.id);

        // get dish counts for each restaurant
        const dishCountsMap = await fetchDishCounts(restaurantIds);

        // get ratings for each restaurant
        const ratingsMap = await fetchRestaurantRatings(restaurantIds);

        // merging data
        const restaurantsWithStats = data.map((restaurant) => {
          const ratings = ratingsMap[restaurant.id] || [];
          const averageRating =
            ratings.length > 0
              ? (
                  ratings.reduce((sum, rating) => sum + rating, 0) /
                  ratings.length
                ).toFixed(1)
              : 0;

          return {
            ...restaurant,
            average_rating: parseFloat(averageRating),
            total_reviews: ratings.length,
            dish_count: dishCountsMap[restaurant.id] || 0, // إضافة عدد الأطباق
          };
        });

        console.log(restaurantsWithStats);
        setRestaurants(restaurantsWithStats);
        setFilteredRestaurants(restaurantsWithStats);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("حدث خطأ في تحميل المطاعم");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  if (loading) {
    return (
      <div className="AllResApi container py-5" dir="rtl">
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="mt-3 text-light">جاري تحميل المطاعم...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="AllResApi container py-5" dir="rtl">
        <div className="alert alert-danger text-center">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => window.location.reload()}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="AllResApi container py-5" dir="rtl">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-5 text-black !font-semibold">
            <FaUtensils className="me-2 text-warning" />
            المطاعم المتاحة
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row !mb-10 !px-4">
        <div className="w-full flex flex-row justify-between !mx-auto max-md:flex-col max-md:justify-center max-md:items-center">
          <h3 className="!text-2xl max-md:mb-4">مطاعمنا</h3>
          <div
            className="flex items-center px-3 py-2 rounded"
            style={{ border: "1px solid #ccc", backgroundColor: "#fff" }}
          >
            <GoSearch size={20} className="ms-2 text-gray-500" />
            <input
              type="text"
              className="form-control border-0 p-0 ms-2"
              placeholder="ابحث عن مطعم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                outline: "none",
                boxShadow: "none",
                color: "#000",
                backgroundColor: "transparent",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="w-full flex flex-row justify-center flex-wrap gap-4"
        style={{ justifyContent: "center" }}
      >
        {/* check if there`s any resturants */}
        {filteredRestaurants.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FaUtensils size={64} className="text-muted mb-3" />
            <h4 className="text-muted">
              {searchTerm
                ? "لم يتم العثور على مطاعم"
                : "لا توجد مطاعم متاحة حالياً"}
            </h4>
            <p className="text-muted">
              {searchTerm
                ? "جرب البحث باسم آخر أو تحقق من التهجئة"
                : "لم يتم إضافة أي مطاعم بعد أو أن المطاعم قيد المراجعة"}
            </p>
          </div>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="w-1/4 flex flex-col justify-center items-center mb-4 px-2 max-md:w-[90%] max-md:gap-5 max-md:mb-10"
            >
              <div
                className="card w-full text-center !h-100 !position-relative"
                style={{
                  border: "none",
                  borderRadius: "15px",
                  backgroundColor: "#fff",
                  color: "#000",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  paddingTop: "70px",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* restaurant Image */}
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    backgroundColor: "#2A2634",
                    overflow: "hidden",
                    border: "3px solid #fff",
                    position: "absolute",
                    top: "-40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {restaurant.image_url ? (
                    <Image
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      width={100}
                      height={100}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-dark">
                      <FaUtensils className="text-warning" size={32} />
                    </div>
                  )}
                </div>

                <div className="card-body !px-3">
                  {/* restaurant name */}
                  <h5 className="fw-bold mb-2" style={{ minHeight: "48px" }}>
                    {restaurant.name}
                  </h5>

                  {/* reviews and num of dishes*/}
                  <div className="flex flex-row justify-between items-center mb-3">
                    <div className="flex flex-col items-center">
                      <span className="text-warning fw-bold d-flex align-items-center">
                        <FaStar className="text-amber-400 me-1" />
                        {restaurant.average_rating}
                      </span>
                      <small className="text-muted">
                        ({restaurant.total_reviews} تقييم)
                      </small>
                    </div>

                    {/* count of dishes */}
                    <div className="flex flex-col items-center">
                      <span className="fw-bold">{restaurant.dish_count}</span>
                      <small className="text-muted">الأطباق</small>
                    </div>
                  </div>

                  {/* restaurant details*/}
                  <div className="restaurant-info !mb-3">
                    {restaurant.address && (
                      <div className="flex items-center justify-center mb-2">
                        <FaMapMarkerAlt
                          className="text-danger me-2"
                          size={14}
                        />
                        <small
                          className="text-muted"
                          style={{ fontSize: "16px" }}
                        >
                          {restaurant.address.length > 20
                            ? `${restaurant.address.substring(0, 20)}...`
                            : restaurant.address}
                        </small>
                      </div>
                    )}

                    {/* Restaurant Phone */}
                    {restaurant.phone && (
                      <div className="flex items-center justify-center">
                        <FaPhone className="text-primary me-2" size={14} />
                        <small
                          className="text-muted"
                          style={{ fontSize: "16px" }}
                        >
                          {restaurant.phone}
                        </small>
                      </div>
                    )}
                  </div>

                  {/* restaurant description */}
                  {restaurant.description && (
                    <p
                      className="text-muted small mb-3"
                      style={{
                        minHeight: "40px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: "16px",
                      }}
                    >
                      {restaurant.description}
                    </p>
                  )}
                </div>

                {/* order now btn and favorite btn */}
                <div className="card-footer bg-transparent border-0 pt-0 !px-3">
                  <div className="flex justify-center items-center gap-2">
                    <Link
                      href={`/pages/allResturants/${restaurant.id}`}
                      className="btn py-2 px-1.5 bg-amber-600 text-white rounded-2xl flex-grow-1 fw-bold"
                      style={{ fontSize: "14px" }}
                    >
                      أطلب الآن
                    </Link>
                    <MdFavoriteBorder
                      className="cursor-pointer"
                      style={{ fontSize: "24px", color: "#000" }}
                      onClick={() =>
                        console.log("Add to favorites:", restaurant.id)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
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
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2) !important;
        }
        .btn-warning {
          background: linear-gradient(45deg, #ffd700, #ffa500);
          border: none;
          transition: all 0.3s ease;
        }
        .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
        }
      `}</style>
    </div>
  );
};

export default AllResApi;
