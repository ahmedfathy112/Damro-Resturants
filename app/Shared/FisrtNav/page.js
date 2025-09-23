"use client";
import React, { useState } from "react";
import { FaArrowAltCircleDown, FaShoppingCart, FaTimes } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";
import Image from "next/image";
import { useAuth } from "../../context/Authcontext";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabaseClient";
import Swal from "sweetalert2";

const FirstNav = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { userAddress, resturantAddress, isCustomer, Isresturant, userId } =
    useAuth();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getTotalItems,
    clearCart,
    restaurantId,
  } = useCart();

  const createOrder = async () => {
    try {
      if (cart.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "مازالت السله فارغه",
        });
        return;
      }

      if (!userId) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "يرجي التسجيل اولا",
        });
        return;
      }

      // تحضير بيانات العناصر للتنسيق المناسب للدالة المخزنة
      const orderItems = cart.map((item) => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
      }));

      // استدعاء الدالة المخزنة
      const { data: orderId, error } = await supabase.rpc(
        "create_order_with_items",
        {
          p_user_id: userId,
          p_restaurant_id: restaurantId,
          p_total_amount: getCartTotal(),
          p_items: orderItems,
        }
      );

      if (error) {
        console.error("Error creating order:", error);

        return;
      }

      // make the cart empty after the order succsess
      clearCart();
      setIsCartOpen(false);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "تم حفظ الاوردر بنجاح.. يرجي متابعه لوحه التحكم الخاصه بك",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "حدث خطأ ما يرجي المحاوله لاحقا.",
      });
    }
  };

  const totalItems = getTotalItems();
  const totalPrice = getCartTotal();

  // if there`s no items in he cart
  if (Isresturant || totalItems === 0) {
    return (
      <div className="!bg-[#FAFAFA] rounded-b-[12px] w-full flex justify-between cursor-pointer !px-7 max-md:flex-col max-md:!mt-5">
        <div className="flex flex-row gap-3 items-center !py-3 !pl-[10px] max-md:!py-3">
          <MdAddLocationAlt size={30} color="#000 mr-3" />
          <p className="text-xl !text-[#000]">
            {isCustomer ? userAddress : resturantAddress}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="!bg-[#FAFAFA] rounded-b-[12px] w-full flex justify-between cursor-pointer !px-7 max-md:flex-col max-md:!mt-5">
        {/* Address */}
        <div className="flex flex-row gap-3 items-center !py-3 !pl-[10px] max-md:!py-3">
          <MdAddLocationAlt size={30} color="#000 mr-3" />
          <p className="text-xl !text-[#000]">
            {isCustomer ? userAddress : resturantAddress}
          </p>
        </div>

        {/*  */}
        <div
          className="flex flex-row items-center !bg-[#028643] rounded-b-[12px] !px-6 !py-5 hover:!bg-[#026838] transition-colors"
          onClick={() => setIsCartOpen(true)}
        >
          <div className="border-r-[1px] text-[26px] font-bold text-[#ffffff] px-[8px]">
            <FaShoppingCart />
          </div>
          <div className="border-r-[1px] text-[16px] font-bold text-[#ffffff] px-[8px]">
            {totalItems} عنصر
          </div>
          <div className="border-r-[1px] text-[16px] font-bold text-[#ffffff] px-[8px]">
            £{totalPrice.toFixed(2)}
          </div>
          <div className="text-[26px] font-bold text-[#ffffff] px-[8px]">
            <FaArrowAltCircleDown />
          </div>
        </div>
      </div>

      <CartPopup
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        total={totalPrice}
        onCreateOrder={createOrder}
      />
    </>
  );
};

// cart section
const CartPopup = ({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeFromCart,
  total,
  onCreateOrder,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      <div className="fixed h-screen mt-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-md:max-w-sm max-md:left-[45%]">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-br !from-orange-400 !to-red-500">
            <div className="absolute inset-0 bg-black/30" />
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 left-4 w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 !text-sm !text-gray-600 !mb-2">
                <span className="text-orange-500">العروض الخاصة</span>
                <span>›</span>
                <span>اختيار العدد</span>
              </div>
              <h2 className="text-lg font-bold !text-gray-900 text-right">
                من فضلك اختر العدد
              </h2>
            </div>

            {/* Items List */}
            <div className="p-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-100"
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image_url || "/images/CartProduct.png"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 text-right">
                    <h3 className="font-bold !text-[17px] !text-gray-900">
                      {item.name}
                    </h3>
                    {item.category && (
                      <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mt-1">
                        {item.category}
                      </span>
                    )}
                    <p className="text-warning mt-1">£{item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(0, item.quantity - 1))
                      }
                      className="w-8 h-8 rounded-full border-2 border-gray-400 text-gray-600 hover:border-gray-600 flex items-center justify-center"
                    >
                      −
                    </button>

                    <span className="min-w-[2rem] text-center font-bold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border-2 border-gray-400 text-gray-600 hover:border-gray-600 flex items-center justify-center"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row-reverse gap-3 justify-between items-center">
              <div className="order-2 sm:order-1">
                <button
                  onClick={onCreateOrder}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                >
                  تأكيد الطلب £{total.toFixed(2)}
                </button>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  لا يمكن حساب رسوم التوصيل في هذه المرحلة
                </p>
              </div>

              <div className="order-1 sm:order-2 flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  خذني للخلف
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FirstNav;
