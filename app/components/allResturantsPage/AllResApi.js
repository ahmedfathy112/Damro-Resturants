"use client";
import React, { useEffect, useState } from "react";
import { FaStar, FaMapMarkerAlt, FaPhone, FaUtensils } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/Authcontext";

const AllResApi = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useAuth();
  const [dishCount, setDishCount] = useState(0);

  // to fetch number of dishes for the restaurant
  useEffect(() => {
    const fetchRestaurantDishCount = async () => {
      if (!userId) return;

      try {
        const { count, error } = await supabase
          .from("menu_items")
          .select("*", { count: "exact", head: true })
          .eq("restaurant_id", userId);

        if (error) throw error;

        setDishCount(count || 0);
      } catch (error) {
        console.error("Error fetching dish count:", error);
      }
    };

    fetchRestaurantDishCount();
  }, [userId]);

  // to fetch all restaurants
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

        // calculate average rating and number of dishes for each restaurant
        const restaurantsWithStats = data.map((restaurant) => {
          const ratings =
            restaurant.reviews?.map((review) => review.rating) || [];
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
          };
        });

        setRestaurants(restaurantsWithStats);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("حدث خطأ في تحميل المطاعم");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

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

      <div
        className="row g-4 mt-4 d-flex align-items-center"
        style={{ justifyContent: "center" }}
      >
        {restaurants.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FaUtensils size={64} className="text-muted mb-3" />
            <h4 className="text-muted">لا توجد مطاعم متاحة حالياً</h4>
            <p className="text-muted">
              لم يتم إضافة أي مطاعم بعد أو أن المطاعم قيد المراجعة
            </p>
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="col-lg-3 col-md-4 col-sm-6 col-12 mb-5 pb-1"
            >
              <div
                className="card text-center h-100 position-relative"
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
                {/* resturant Image */}
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

                <div className="card-body">
                  {/* resturant name */}
                  <h5 className="fw-bold mb-2" style={{ minHeight: "48px" }}>
                    {restaurant.name}
                  </h5>

                  {/* reviews and num of dishes*/}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex flex-column align-items-center">
                      <span className="text-warning fw-bold d-flex align-items-center">
                        <FaStar className="text-amber-400 me-1" />
                        {restaurant.average_rating}
                      </span>
                      <small className="text-muted">
                        ({restaurant.total_reviews} تقييم)
                      </small>
                    </div>

                    <div className="d-flex flex-column align-items-center">
                      <span className="fw-bold">{dishCount}</span>
                      <small className="text-muted">الأطباق</small>
                    </div>
                  </div>

                  {/* resturant details*/}
                  <div className="restaurant-info mb-3">
                    {restaurant.address && (
                      <div className="d-flex align-items-center justify-content-center mb-2">
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

                    {/* Resturant Phone */}
                    {restaurant.phone && (
                      <div className="d-flex align-items-center justify-content-center">
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

                  {/* resturant description */}
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
                <div className="card-footer bg-transparent border-0 pt-0">
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <Link
                      href={`/pages/allResturants/${restaurant.id}`}
                      className="btn btn-warning flex-grow-1 fw-bold"
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

      {/* التنسيقات الإضافية */}
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
