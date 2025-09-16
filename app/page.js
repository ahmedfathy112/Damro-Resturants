"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// استيراد أنماط Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";

const Home = () => {
  const categories = [
    {
      id: 1,
      name: "البرجر ",
      restaurants: "21 مطعم",
      image: "/Images/category.png", // سيتم إضافة رابط الصورة هنا
      bgColor: "#FFF3CD",
    },
    {
      id: 2,
      name: "السلطات",
      restaurants: "32 مطعم",
      image: "/Images/category.png", // سيتم إضافة رابط الصورة هنا
      bgColor: "#E8F5E8",
    },
    {
      id: 3,
      name: "المعكرونة",
      restaurants: "4 مطاعم",
      image: "/Images/category.png", // سيتم إضافة رابط الصورة هنا
      bgColor: "#FFE5CC",
    },
    {
      id: 4,
      name: "البيتزا",
      restaurants: "4 مطاعم",
      image: "/Images/category.png", // سيتم إضافة رابط الصورة هنا
      bgColor: "#FFE0E0",
    },
    {
      id: 5,
      name: "الإفطار",
      restaurants: "4 مطاعم",
      image: "/Images/category.png", // سيتم إضافة رابط الصورة هنا
      bgColor: "#E0F0FF",
    },
    {
      id: 6,
      name: "الشوربة",
      restaurants: "32 مطعم",
      image: "/Images/category.png", // سيتم إضافة رابط الصورة هنا
      bgColor: "#F0E5FF",
    },
  ];
  const BestResturant = [
    {
      id: 1,
      name: "مطعم زنجر",

      image: "/Images/category.png", // سيتم إضافة رابط الصورة هنا
      bgColor: "#FFF3CD",
    },
    {
      id: 2,
      name: "لقمة هنية",

      image: "/Images/category.png", // سيتم إضافة رابط الصورة هنا
      bgColor: "#E8F5E8",
    },
    {
      id: 3,
      name: "وصاية",

      image: "/Images/category.png", // سيتم إضافة رابط الصورة هنا
      bgColor: "#FFE5CC",
    },
    {
      id: 4,
      name: "مطعم ميكس",

      image: "/Images/category.png", // سيتم إضافة رابط الصورة هنا
      bgColor: "#FFE0E0",
    },
    {
      id: 5,
      name: "مطعم هرفي",

      image: "/Images/category.png", // سيتم إضافة رابط الصورة هنا
      bgColor: "#E0F0FF",
    },
  ];
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
              src="/Images/HeroSec2.png"
              alt="Hero Section Background"
              width={805}
              height={537}
              className="object-cover"
            />
          </div>

          {/* Background woman image - Mobile/Tablet */}
          <div className="absolute left-0 top-0 z-10 lg:hidden opacity-30">
            <Image
              src="/Images/HeroSec2.png"
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
                  اطلب طعام المطعم، الوجبات الجاهزة والبقالة.
                </p>

                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-2">
                  أشبع حواسك،
                </h1>
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-8"
                  style={{ color: "#FC8A06" }}
                >
                  بسرعة وطازج
                </h1>

                <p className="text-white/70 text-xs sm:text-sm mb-8">
                  أدخل الرمز البريدي لمعرفة ما نوصله
                </p>

                {/* Search bar */}
                <div className="flex w-full max-w-md mr-auto bg-white rounded-full overflow-hidden shadow-lg">
                  <input
                    type="text"
                    placeholder="مثال: EC4R 3TE"
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-gray-700 placeholder-gray-400 focus:outline-none text-right text-sm sm:text-base"
                    dir="rtl"
                  />
                  <button
                    className="px-4 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-full text-sm sm:text-base"
                    style={{ backgroundColor: "#FC8A06" }}
                  >
                    بحث
                  </button>
                </div>
              </div>

              {/* Image Section */}
              <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-start order-1 lg:order-2">
                {/* Desktop Image */}
                <div className="hidden lg:block">
                  <Image
                    src="/Images/HeroSec1.png"
                    alt="امرأة تحمل البيتزا"
                    width={565}
                    height={641}
                    className="translate-x-[100px] xl:translate-x-[200px] z-30 object-contain"
                  />
                </div>

                {/* Mobile/Tablet Image */}
                <div className="lg:hidden">
                  <Image
                    src="/Images/HeroSec1.png"
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

        {/* Category Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Title */}
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
                الفئات الشائعة في Order.uk 😋
              </h2>
            </div>

            {/* Categories Flexbox */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative w-[208px] cursor-pointer hover:transform hover:scale-105 transition-all duration-300 max-md:w-[45%]"
                  style={{
                    height: "266px",
                    borderRadius: "12px",
                  }}
                >
                  {/* Card Container */}
                  <div
                    className="w-full h-full relative overflow-hidden"
                    style={{
                      backgroundColor: "#03081F",
                      borderRadius: "12px",
                    }}
                  >
                    {/* Image Container */}
                    <div
                      className="relative overflow-hidden w-[238px] h-[203px] max-md:w-full mx-auto max-md:h-[190px]"
                      style={{
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        backgroundColor: category.bgColor,
                      }}
                    >
                      {category.image && (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      )}

                      {/* Placeholder for image when no src provided */}
                      {!category.image && (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: category.bgColor }}
                        >
                          <div className="text-gray-400 text-sm text-center">
                            صورة {category.name}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="absolute -bottom-3 left-0 right-0 p-4 text-right my-auto">
                      <h3 className="text-orange-500 font-semibold text-lg mb-1">
                        {category.name}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {category.restaurants}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Best Resturant Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Title */}
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
                أشهر المطاعم
              </h2>
              <button className="font-semibold text-[17px] text-center border-2 py-1 px-4 rounded-2xl border-orange-500 text-orange-500 cursor-pointer">
                كل المطاعم
              </button>
            </div>

            {/* Swiper Slider */}
            <div className="restaurant-slider-container">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  640: {
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 4,
                  },
                  1024: {
                    slidesPerView: 5,
                  },
                }}
                style={{ padding: "10px 0 30px" }}
              >
                {BestResturant.map((category) => (
                  <SwiperSlide key={category.id}>
                    <Link href="/resturantProfile" key={category.id}>
                      <div
                        className="relative w-[248px] cursor-pointer hover:transform hover:scale-105 transition-all duration-300 mx-auto"
                        style={{
                          height: "266px",
                          borderRadius: "12px",
                        }}
                      >
                        {/* Card Container */}
                        <div
                          className="w-full h-full relative overflow-hidden"
                          style={{
                            backgroundColor: "#03081F",
                            borderRadius: "12px",
                          }}
                        >
                          {/* Image Container */}
                          <div
                            className="relative overflow-hidden"
                            style={{
                              width: "248px",
                              height: "203px",
                              borderTopLeftRadius: "12px",
                              borderTopRightRadius: "12px",
                              backgroundColor: category.bgColor,
                            }}
                          >
                            {/* Placeholder for image when no src provided */}
                            <Image
                              width={248}
                              height={203}
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full flex items-center justify-center"
                            ></Image>
                          </div>

                          {/* Content Section */}
                          <div className="absolute -bottom-3 left-0 right-0 p-4 text-center my-auto">
                            <h3 className="text-orange-500 font-semibold text-lg mb-1">
                              {category.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <style jsx>{`
            .restaurant-slider-container {
              direction: ltr;
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
              }
            }
          `}</style>
        </section>
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
                    src="/Images/PartnerWith.png"
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
                    src="/Images/RideWith.png"
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
      </main>
    </>
  );
};

export default Home;
