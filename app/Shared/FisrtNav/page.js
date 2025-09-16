"use client";
import React, { useState } from "react";
import { FaArrowAltCircleDown, FaShoppingCart, FaTimes } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";
import Image from "next/image";

const FirstNav = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sample cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "مارغريتا",
      quantity: 1,
      price: 15.5,
      size: "113 × 113",
      image: "",
      selected: true,
    },
    {
      id: 2,
      name: "بولو",
      quantity: 1,
      price: 18.2,
      image: "",
      selected: false,
    },
    {
      id: 3,
      name: "لحم فييست",
      quantity: 1,
      price: 22.1,
      image: "",
      selected: false,
    },
    {
      id: 4,
      name: "هاواي",
      quantity: 2,
      price: 19.8,
      image: "",
      selected: false,
    },
    {
      id: 5,
      name: "توسكانا",
      quantity: 1,
      price: 21.4,
      image: "",
      selected: false,
    },
    {
      id: 6,
      name: "توسكانا",
      quantity: 1,
      price: 21.4,
      image: "",
      selected: false,
    },
  ]);

  const updateQuantity = (index, newQuantity) => {
    const updated = [...cartItems];
    updated[index].quantity = newQuantity;
    setCartItems(updated);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <div className="!bg-[#FAFAFA] rounded-b-[12px] w-full flex justify-between cursor-pointer !px-7 max-md:flex-col max-md:!mt-5">
        {/* Address */}
        <div className="flex flex-row gap-3 items-center !pl-[10px] max-md:!py-3">
          <MdAddLocationAlt size={30} color="#000 mr-3" />
          <p className="text-xl !text-[#000]">دمرو بجوار قهوه البرج</p>
        </div>

        {/* cart options */}
        <div
          className="flex flex-row items-center !bg-[#028643] rounded-b-[12px] !px-6 !py-5 hover:!bg-[#026838] transition-colors"
          onClick={() => setIsCartOpen(true)}
        >
          {/* Cart Icon */}
          <div className="border-r-[1px] text-[26px] font-bold text-[#ffffff] px-[8px]">
            <FaShoppingCart />
          </div>
          {/* Cart Items */}
          <div className="border-r-[1px] text-[16px] font-bold text-[#ffffff] px-[8px]">
            {totalItems} عنصر
          </div>
          {/* Cart Balance */}
          <div className="border-r-[1px] text-[16px] font-bold text-[#ffffff] px-[8px]">
            £{totalPrice.toFixed(2)}
          </div>
          {/* Cart Open Icon */}
          <div className="text-[26px] font-bold text-[#ffffff] px-[8px]">
            <FaArrowAltCircleDown />
          </div>
        </div>
      </div>

      {/* Cart Popup */}
      <CartPopup
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        total={127.9} // يمكن حسابها من البيانات
      />
    </>
  );
};

export default FirstNav;

// Cart Popup Component
const CartPopup = ({ isOpen, onClose, cartItems, updateQuantity, total }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Popup */}
      <div className="fixed h-screen mt-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-md:max-w-sm max-md:left-[45%]">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header with Pizza Image */}
          <div className="relative h-48 bg-gradient-to-br !from-orange-400 !to-red-500">
            <Image
              src="/Images/CartImage.png"
              alt="Pizza Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 left-4 w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Breadcrumb */}
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
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 !p-4 rounded-xl transition-all ${
                    item.selected
                      ? "!bg-gray-900 !text-white"
                      : "!bg-gray-100 hover:!bg-gray-200"
                  }`}
                  style={{
                    maxWidth: "100%",
                    minHeight: "80px",
                  }}
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image || "/Images/CartProduct.png"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 text-right">
                    <h3
                      className={`font-bold !text-[17px] ${
                        item.selected ? "!text-white" : "!text-gray-900"
                      }`}
                    >
                      {item.name}
                    </h3>
                    {item.size && (
                      <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mt-1">
                        {item.size}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(index, Math.max(0, item.quantity - 1))
                      }
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-colors ${
                        item.selected
                          ? "border-white text-white hover:bg-white hover:text-gray-900"
                          : "border-gray-400 text-gray-600 hover:border-gray-600"
                      }`}
                    >
                      −
                    </button>

                    <span
                      className={`min-w-[2rem] text-center font-bold ${
                        item.selected ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-colors ${
                        item.selected
                          ? "border-white text-white hover:bg-white hover:text-gray-900"
                          : "border-gray-400 text-gray-600 hover:border-gray-600"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row-reverse gap-3 justify-between items-center">
              {/* Total Price */}
              <div className="order-2 sm:order-1">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors">
                  أضف للسلة £{total.toFixed(2)}
                </button>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  لا يمكن حساب رسوم التوصيل في هذه المرحلة
                </p>
              </div>

              {/* Action Buttons */}
              <div className="order-1 sm:order-2 flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  خذني للخلف
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-colors">
                  الخطوة التالية
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
