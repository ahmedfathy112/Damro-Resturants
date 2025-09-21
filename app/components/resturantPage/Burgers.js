"use client";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaFilter, FaUtensils } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/Authcontext";

const RestaurantMenu = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart, restaurantId: currentRestaurantId } = useCart();
  const { isCustomer } = useAuth();

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

  const handleAddToCart = (item) => {
    addToCart(item, restaurantId);
  };

  if (loading) {
    return (
      <div className="mt-3 px-4 pb-3 my-4">
        <h1 className="mb-4 text-end">قائمة الطعام</h1>
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="mt-3">جاري تحميل قائمة الطعام...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 px-4 pb-3 my-4">
        <h1 className="mb-4 text-end">قائمة الطعام</h1>
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="mt-3 px-4 pb-3 my-4" style={{ overflow: "hidden" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-end mb-0">قائمة الطعام</h1>

        {/* Num of dishes */}
        <span className="badge bg-warning text-dark fs-6">
          {filteredItems.length} طبق
        </span>
      </div>

      {/* filtering */}
      {categories.length > 1 && (
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <FaFilter className="text-warning" />
            <h6 className="mb-0">التصنيفات:</h6>
          </div>

          <div className="d-flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`btn btn-sm ${
                  selectedCategory === category
                    ? "btn-warning"
                    : "btn-outline-warning"
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
          <FaUtensils size={48} className="text-muted mb-3" />
          <p className="text-muted">
            {selectedCategory === "الكل"
              ? "لا توجد أطباق متاحة حالياً"
              : `لا توجد أطباق في تصنيف ${selectedCategory}`}
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredItems.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
              <div className="card position-relative h-100 p-3 shadow">
                <div
                  className="d-flex flex-row gap-3 align-items-center"
                  style={{ justifyContent: "space-between" }}
                >
                  {/* item image */}
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={150}
                      height={150}
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
                      <FaUtensils className="text-muted" size={32} />
                    </div>
                  )}

                  <div className="text-end flex-grow-1">
                    {/* categories */}
                    {item.category && (
                      <span className="badge bg-light text-dark mb-2">
                        {item.category}
                      </span>
                    )}

                    <h5 className="fw-bold mb-2">{item.name}</h5>

                    {item.description && (
                      <p className="text-muted small mb-2">
                        {item.description.length > 60
                          ? `${item.description.substring(0, 60)}...`
                          : item.description}
                      </p>
                    )}

                    {item.preparation_time && (
                      <p className="text-muted small mb-2">
                        ⏱️ {item.preparation_time} دقيقة
                      </p>
                    )}

                    <strong className="text-warning fs-5">
                      {item.price} ج.م
                    </strong>
                  </div>
                </div>

                {/* make sure that the Customer make the order */}
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
                      e.target.style.backgroundColor = "rgb(255, 193, 7, 0.9)";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor =
                        "rgb(256, 256, 256, 0.9)";
                      e.target.style.transform = "scale(1)";
                    }}
                    onClick={() => handleAddToCart(item)}
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
  );
};

export default RestaurantMenu;
