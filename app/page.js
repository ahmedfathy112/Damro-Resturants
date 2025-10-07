"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { supabase } from "./lib/supabaseClient";
import { IoMdAdd } from "react-icons/io";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/Authcontext";
import { Phone, Star, Utensils } from "lucide-react";
import Footer from "./Shared/Footer/Footer";

const Home = () => {
  const [loading, setLoading] = useState(true);

  // make a loading for 3 sec every time the user back to home page
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="ml-4 text-lg font-semibold text-gray-700"></p>
      </div>
    );
  }
  return (
    <>
      <main className=" h-screen px-[20px]">
        {/* Hero Section */}
        <section
          className="relative min-h-screen overflow-hidden"
          style={{ backgroundColor: "#03081F" }}
        >
          {/* Orange decorative shape */}
          <div
            className="absolute hidden lg:block"
            style={{
              width: "626px",
              height: "565px",
              top: "100px",
              left: "0px",
              backgroundColor: "#FC8A06",
              borderTopRightRadius: "282.5px",
              borderBottomRightRadius: "12px",
              opacity: 1,
              zIndex: 1,
            }}
          />

          {/* Mobile Orange decorative shape */}
          <div
            className="absolute lg:hidden"
            style={{
              width: "300px",
              height: "280px",
              top: "50px",
              left: "0px",
              backgroundColor: "#FC8A06",
              borderTopRightRadius: "140px",
              borderBottomRightRadius: "12px",
              opacity: 1,
              zIndex: 1,
            }}
          />

          {/* Background woman image - Desktop */}
          <div className="absolute left-0 top-0 z-10 hidden lg:block">
            <Image
              src="/images/HeroSec2.png"
              alt="Hero Section Background"
              width={805}
              height={537}
              className="object-cover"
            />
          </div>

          {/* Background woman image - Mobile/Tablet */}
          <div className="absolute left-0 top-0 z-10 lg:hidden opacity-30">
            <Image
              src="/images/HeroSec2.png"
              alt="Hero Section Background"
              width={400}
              height={300}
              className="object-cover w-full h-auto"
            />
          </div>

          <div className="container w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="w-full flex flex-col lg:flex-row-reverse justify-between gap-8 items-center min-h-screen py-20 lg:py-0">
              {/* Content Section */}
              <div className="w-full lg:w-1/2 text-right order-2 lg:order-1">
                <p className="text-white/80 text-xs sm:text-sm mb-4 font-medium">
                  أطلب من مطعمك المفضل وسيصلك أينما كنت.
                </p>

                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-2">
                  طلبك بقا اسهل
                </h1>
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-8"
                  style={{ color: "#FC8A06" }}
                >
                  بسرعة وطازج
                </h1>
              </div>

              {/* Image Section */}
              <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-start order-1 lg:order-2">
                {/* Desktop Image */}
                <div className="hidden lg:block">
                  <Image
                    src="/images/HeroSec1.png"
                    alt="امرأة تحمل البيتزا"
                    width={565}
                    height={641}
                    className="translate-x-[100px] xl:translate-x-[200px] z-30 object-contain"
                  />
                </div>

                {/* Mobile/Tablet Image */}
                <div className="lg:hidden">
                  <Image
                    src="/images/HeroSec1.png"
                    alt="امرأة تحمل البيتزا"
                    width={300}
                    height={350}
                    className="z-30 object-contain max-w-[250px] sm:max-w-[300px] md:max-w-[350px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* last items added Section */}
        <RecentDishesSection />
        {/* Best Resturant Section */}
        <RecentRestaurantsSection />
        {/* Partner section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-row flex-wrap gap-8 justify-center">
              {/* Business Partnership Card */}
              <div
                className="relative overflow-hidden rounded-2xl shadow-lg w-[45%] max-md:w-full"
                style={{
                  height: "425px",
                  background:
                    "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))",
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/PartnerWith.png"
                    alt="خلفية شراكة الأعمال"
                    fill
                    className="object-cover"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/60"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8">
                  {/* Top badge */}
                  <div className="flex justify-end">
                    <div className="bg-white px-4 py-2 rounded-full">
                      <span className="text-gray-800 font-medium text-sm">
                        اكسب أكثر مع رسوم أقل
                      </span>
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="text-right">
                    <p className="text-orange-400 text-sm font-medium mb-2">
                      سجل كصاحب عمل
                    </p>
                    <h3 className="text-white text-3xl lg:text-4xl font-bold mb-6">
                      شارك معنا
                    </h3>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-300">
                      ابدأ الآن
                    </button>
                  </div>
                </div>
              </div>

              {/* Rider Partnership Card */}
              <div
                className="relative overflow-hidden rounded-2xl w-[45%] max-md:w-full shadow-lg"
                style={{
                  height: "425px",
                  background:
                    "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))",
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/RideWith.png"
                    alt="خلفية شراكة السائقين"
                    fill
                    className="object-cover"
                  />
                  {/* Light overlay */}
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8">
                  {/* Top badge */}
                  <div className="flex justify-end">
                    <div className="bg-white px-4 py-2 rounded-full">
                      <span className="text-gray-800 font-medium text-sm">
                        احصل على مزايا حصرية
                      </span>
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="text-right">
                    <p className="text-orange-400 text-sm font-medium mb-2">
                      سجل كسائق
                    </p>
                    <h3 className="text-white text-3xl lg:text-4xl font-bold mb-6">
                      اركب معنا
                    </h3>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-300">
                      ابدأ الآن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Home;

const RecentDishesSection = () => {
  const [recentDishes, setRecentDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, restaurantId: currentRestaurantId } = useCart();
  const { isCustomer } = useAuth();

  useEffect(() => {
    fetchRecentDishes();
  }, []);

  const fetchRecentDishes = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("menu_items")
        .select(
          `
          id,
          name,
          price,
          image_url,
          description,
          created_at,
          restaurants (
            id,
            name
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching recent dishes:", error);
        return;
      }

      setRecentDishes(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item, restaurantId) => {
    addToCart(item, restaurantId);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-right mb-12">
            <h2
              className="text-black mb-2"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "32px",
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              الأكلات المضافه حديثا
            </h2>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-end gap-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="relative w-[208px] cursor-pointer max-md:w-[45%] animate-pulse"
                style={{
                  height: "266px",
                  borderRadius: "12px",
                }}
              >
                <div
                  className="w-full h-full relative overflow-hidden"
                  style={{
                    backgroundColor: "#f3f4f6",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    className="relative overflow-hidden w-full h-[203px] max-md:h-[190px] bg-gray-300"
                    style={{
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                  ></div>
                  <div className="absolute -bottom-3 left-0 right-0 p-4 text-right">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="!py-16 !bg-white">
      <div className="container mx-auto !px-4">
        <div className="!text-right !mb-12">
          <h2
            className="!text-black !mb-2"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "32px",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            الأكلات المضافه حديثا
          </h2>
        </div>

        {recentDishes.length === 0 ? (
          <div className="!text-center !py-8">
            <p className="!text-gray-500">لا توجد أطباق مضافة حديثاً</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center max-md:flex-col lg:justify-end gap-6">
            {recentDishes.map((dish) => (
              <div
                key={dish.id}
                className="relative w-[250px] cursor-pointer hover:transform hover:scale-105 transition-all duration-300 max-md:w-[100%] max-md:!h-[360px]"
                style={{
                  height: "306px",
                  borderRadius: "12px",
                }}
              >
                <div
                  className="w-full h-full relative overflow-hidden"
                  style={{
                    backgroundColor: "#03081F",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    className="relative overflow-hidden w-full !h-[213px] max-md:h-[260px]"
                    style={{
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                      backgroundColor: "#4B5563",
                    }}
                  >
                    {dish.image_url ? (
                      <Image
                        src={dish.image_url}
                        alt={dish.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center !bg-gray-300">
                        <div className="!text-gray-400 !text-sm !text-center">
                          لا توجد صورة
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="absolute mt-5 -bottom-3 left-0 !right-0 !p-4 !text-right">
                    <h3 className="!text-orange-500 !font-semibold !text-lg !mb-1 truncate">
                      {dish.name}
                    </h3>
                    <p className="!text-white/70 !text-sm !mb-1">
                      {dish.price} ج.م
                    </p>
                    <p className="!text-white/50 !text-xs truncate">
                      {dish.restaurants?.name || "مطعم غير معروف"}
                    </p>
                  </div>
                  {/* add to cart btn */}
                  {isCustomer ? (
                    <button
                      className="add"
                      style={{
                        position: "absolute",
                        left: "0",
                        bottom: "0",
                        backgroundColor: "rgb(256, 256, 256, 0.9)",
                        color: "#000",
                        borderRadius: "0 24px 0 0",
                        padding: "15px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor =
                          "rgb(255, 193, 7, 0.9)";
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor =
                          "rgb(256, 256, 256, 0.9)";
                        e.target.style.transform = "scale(1)";
                      }}
                      onClick={() => handleAddToCart(dish, dish.restaurants.id)}
                      title="إضافة إلى السلة"
                    >
                      <IoMdAdd size={22} />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const RecentRestaurantsSection = () => {
  const [recentRestaurants, setRecentRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentRestaurants();
  }, []);

  const fetchRecentRestaurants = async () => {
    try {
      setLoading(true);

      const { data: restaurantsData, error } = await supabase
        .from("restaurants")
        .select(
          `
          id,
          name,
          phone,
          image_url,
          created_at,
          address,
          menu_items (id),
          reviews (rating)
        `
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching recent restaurants:", error);
        return;
      }

      const formattedRestaurants = restaurantsData.map((restaurant) => {
        // calculate reting
        const ratings =
          restaurant.reviews?.map((review) => review.rating) || [];
        const averageRating =
          ratings.length > 0
            ? (
                ratings.reduce((sum, rating) => sum + rating, 0) /
                ratings.length
              ).toFixed(1)
            : "0.0";

        // calculate dish count
        const dishesCount = restaurant.menu_items?.length || 0;

        return {
          id: restaurant.id,
          name: restaurant.name,
          phone: restaurant.phone,
          image_url: restaurant.image_url,
          cuisine_type: restaurant.cuisine_type,
          address: restaurant.address,
          rating: averageRating,
          dishes_count: dishesCount,
          created_at: restaurant.created_at,
        };
      });

      setRecentRestaurants(formattedRestaurants);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="w-full flex justify-between flex-row-reverse mb-12">
            <h2
              className="text-black mb-2"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "32px",
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              أحدث المطاعم
            </h2>
            <button className="font-semibold text-[17px] text-center border-2 py-1 px-4 rounded-2xl border-orange-500 text-orange-500 cursor-pointer">
              كل المطاعم
            </button>
          </div>

          <div className="restaurant-slider-container">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
              }}
              style={{ padding: "10px 0 30px" }}
            >
              {[...Array(5)].map((_, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="relative w-[248px] cursor-pointer mx-auto animate-pulse"
                    style={{
                      height: "320px",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      className="w-full h-full relative overflow-hidden"
                      style={{
                        backgroundColor: "#f3f4f6",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        className="relative overflow-hidden w-full h-[180px] bg-gray-300"
                        style={{
                          borderTopLeftRadius: "12px",
                          borderTopRightRadius: "12px",
                        }}
                      ></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2 mb-3"></div>
                        <div className="flex justify-between">
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="!py-16 !bg-white w-full">
      <div className="container mx-auto px-4">
        <div className="w-full flex justify-between flex-row-reverse mb-12">
          <h2
            className="text-black mb-2"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "32px",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            أحدث المطاعم
          </h2>
          <Link
            href="/pages/allResturants"
            className="!font-semibold !text-[17px] !text-center !border-2 py-1 px-4 rounded-2xl !border-orange-500 text-orange-500 cursor-pointer"
          >
            كل المطاعم
          </Link>
        </div>

        {recentRestaurants.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد مطاعم مضافة حديثاً</p>
          </div>
        ) : (
          // main content
          <div className="restaurant-slider-container" dir="ltr">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
              }}
              style={{ padding: "10px 0 30px" }}
            >
              {recentRestaurants.map((restaurant) => (
                <SwiperSlide key={restaurant.id}>
                  <Link href={`/pages/allResturants/${restaurant.id}`}>
                    <div
                      className="relative w-[248px] cursor-pointer hover:transform hover:scale-105 transition-all duration-300 mx-auto"
                      style={{
                        height: "380px",
                        borderRadius: "12px",
                        textDecoration: "none",
                      }}
                    >
                      <div
                        className="w-full h-full relative overflow-hidden !bg-white border border-gray-200 shadow-sm"
                        style={{
                          borderRadius: "12px",
                        }}
                      >
                        {/* resturant image */}
                        <div
                          className="relative overflow-hidden w-full h-[180px]"
                          style={{
                            borderTopLeftRadius: "12px",
                            borderTopRightRadius: "12px",
                          }}
                        >
                          {restaurant.image_url ? (
                            <Image
                              src={restaurant.image_url}
                              alt={restaurant.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center !bg-gradient-to-br !from-orange-400 !to-orange-600">
                              <div className="!text-white !text-2xl !font-bold">
                                {restaurant.name.charAt(0)}
                              </div>
                            </div>
                          )}

                          {/* reting */}
                          <div className="absolute top-3 left-3 !bg-white/90 !px-2 !py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 !text-yellow-400" />
                            <span className="!text-xs !font-bold !text-gray-800">
                              {restaurant.rating}
                            </span>
                          </div>
                        </div>

                        {/* content */}
                        <div className="!p-4 !text-right">
                          <h3 className="!text-gray-900 !font-bold !text-lg !mb-1 truncate">
                            {restaurant.name}
                          </h3>

                          {/* additional info */}
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex flex-col items-center gap-1 !text-sm !text-gray-600">
                              <Utensils className="w-4 h-4" />
                              <span>{restaurant.dishes_count} طبق</span>
                            </div>

                            {restaurant.phone && (
                              <div className="flex items-center flex-col gap-1 !text-sm !text-gray-600">
                                <span className="flex flex-row-reverse gap-1.5">
                                  <Phone className="w-4 h-4" />
                                  اتصال
                                </span>
                                {restaurant.phone}
                              </div>
                            )}
                          </div>

                          {/* to go to resturant */}
                          <button className="w-full cursor-pointer !bg-orange-500 !text-white !py-2 !px-4 !rounded-lg hover:!bg-orange-600 transition-colors !text-sm !font-medium">
                            عرض المطعم
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <style jsx>{`
          .restaurant-slider-container {
            direction: rtl;
          }
          :global(.swiper-button-next),
          :global(.swiper-button-prev) {
            color: #f97316;
            background: rgba(255, 255, 255, 0.8);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            padding: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          :global(.swiper-button-next:after),
          :global(.swiper-button-prev:after) {
            font-size: 20px;
            font-weight: bold;
          }
          :global(.swiper-pagination-bullet) {
            background: #cbd5e0;
            opacity: 1;
          }
          :global(.swiper-pagination-bullet-active) {
            background: #f97316;
          }
          @media (max-width: 768px) {
            .restaurant-slider-container {
              padding: 0 10px;
              direction: ltr;
            }
          }
        `}</style>
      </div>
    </section>
  );
};
