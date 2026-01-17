"use client";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaFilter, FaUtensils } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/Authcontext";
import { useRouter } from "next/navigation";

const RestaurantMenu = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart, restaurantId: currentRestaurantId } = useCart();

  const { isCustomer, user, isProfileComplete } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!restaurantId) return;

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        setMenuItems(data || []);
        const uniqueCategories = [
          "الكل",
          ...new Set(data.map((item) => item.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("حدث خطأ في تحميل قائمة الطعام");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  useEffect(() => {
    if (selectedCategory === "الكل") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(
        menuItems.filter((item) => item.category === selectedCategory)
      );
    }
  }, [menuItems, selectedCategory]);
  // add to cart and check if the user complete his info or not
  const handleAddToCart = (item) => {
    if (!isProfileComplete) {
      Swal.fire({
        title: "<strong>بياناتك غير مكتملة!</strong>",
        icon: "info",
        html: `
          أهلاً بك يا <b>${user?.full_name || "عزيزي"}</b>، <br/>
          يجب إضافة <b>رقم الهاتف والعنوان</b> لتتمكن من إتمام الطلب بنجاح.
        `,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-user"></i> أكمل بياناتي الآن',
        confirmButtonColor: "#3085d6",
        cancelButtonText: "إلغاء",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/pages/userDashboard");
        }
      });
      return;
    }
    addToCart(item, restaurantId);
  };

  if (loading) {
    return (
      <div className="mt-3 px-4 pb-3 my-4">
        <h1 className="mb-4 text-right">قائمة الطعام</h1>
        <div className="text-center">
          <div className="flex justify-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
          <p className="mt-3 text-gray-600">جاري تحميل قائمة الطعام...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 px-4 pb-3 my-4">
        <h1 className="mb-4 text-right">قائمة الطعام</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 px-4 pb-3 my-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-right mb-0">قائمة الطعام</h1>

        {/* Num of dishes */}
        <span className="inline-block bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
          {filteredItems.length} طبق
        </span>
      </div>

      {/* filtering */}
      {categories.length > 1 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FaFilter className="text-amber-500" />
            <h6 className="mb-0 text-sm font-semibold">التصنيفات:</h6>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-amber-500 text-white"
                    : "border border-amber-500 text-amber-500 hover:bg-amber-50"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="text-center py-5">
          <FaUtensils size={48} className="text-gray-400 mb-3 mx-auto" />
          <p className="text-gray-500">
            {selectedCategory === "الكل"
              ? "لا توجد أطباق متاحة حالياً"
              : `لا توجد أطباق في تصنيف ${selectedCategory}`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              className="relative p-3 shadow rounded-lg bg-white h-full"
              key={item.id}
            >
              <div className="flex flex-row gap-3 items-center justify-between">
                {/* item image */}
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={150}
                    height={150}
                    priority={true}
                    placeholder="blur"
                    style={{
                      objectFit: "cover",
                      borderRadius: "5px",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  // if there`s no item image
                  <div
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "5px",
                      backgroundColor: "#f8f9fa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FaUtensils className="text-gray-500" size={32} />
                  </div>
                )}

                <div className="text-right flex-grow">
                  {/* categories */}
                  {item.category && (
                    <span className="inline-block bg-gray-100 text-black text-xs px-2 py-1 rounded mb-2">
                      {item.category}
                    </span>
                  )}

                  <h5 className="font-bold mb-2">{item.name}</h5>

                  {item.description && (
                    <p className="text-gray-500 text-xs mb-2">
                      {item.description.length > 60
                        ? `${item.description.substring(0, 60)}...`
                        : item.description}
                    </p>
                  )}

                  {item.preparation_time && (
                    <p className="text-gray-500 text-xs mb-2">
                      ⏱️ {item.preparation_time} دقيقة
                    </p>
                  )}

                  <strong className="text-amber-500 text-base">
                    {item.price} ج.م
                  </strong>
                </div>
              </div>

              {/* make sure that the Customer make the order */}
              {isCustomer ? (
                <button
                  className="add absolute left-0 bottom-0 bg-white text-black rounded-tl-3xl p-3 flex items-center justify-center border-0 cursor-pointer transition-all hover:bg-amber-500 hover:scale-105"
                  onClick={() => handleAddToCart(item)}
                  title="إضافة إلى السلة"
                >
                  <IoMdAdd size={22} />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
