"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaArrowAltCircleDown, FaBars, FaShoppingCart, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext";
import { MdAddLocationAlt } from "react-icons/md";
import Swal from "sweetalert2";

import { useCart } from "../../context/CartContext";


const FirstNav = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const {
    userAddress,
    resturantAddress,
    isCustomer,
    Isresturant,
    userId,
    isAuthenticated,
    user,
  } = useAuth();

  const router = useRouter();
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

      // Ensure user has phone and address before placing an order
      const phone = user?.phone || null;
      const address = user?.address || userAddress || null;

      if (!phone || !address) {
        const result = await Swal.fire({
          icon: "warning",
          title: "الرجاء إكمال الملف الشخصي",
          text: "يجب إضافة رقم الهاتف والعنوان قبل تأكيد الطلب.",
          showCancelButton: true,
          confirmButtonText: "اذهب للملفي",
          cancelButtonText: "لاحقًا",
        });
        if (result.isConfirmed) {
          router.push("/pages/userDashboard/");
        }
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

  // if the user is resturant or is not auth the cart won`t be visible
  if (Isresturant || !isAuthenticated) {
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
      <div className="bg-[#FAFAFA] relative h-[30px] rounded-b-[12px] w-full flex justify-between cursor-pointer !px-7 max-md:flex-col max-md:!mt-5 max-md:mb-8">
        <div className="w-full bg-[#FAFAFA] flex justify-between fixed z-[999] px-4 top-0 max-md:flex-col left-0 max-md:justify-center">
          {/* Address */}
          <div className="flex flex-row gap-3 items-center !py-3 !pl-[10px] max-md:!py-3">
            <MdAddLocationAlt size={30} color="#000 mr-3" />
            <p className="text-xl !text-[#000]">
              {isCustomer ? userAddress : resturantAddress}
            </p>
          </div>

          {/* Cart popup */}
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

          <CartPopup
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            total={totalPrice}
            onCreateOrder={createOrder}
          />
        </div>
      </div>
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




const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, userName, logout, isCustomer, Isresturant } =
    useAuth();
  const router = useRouter();
  let dashboardLink;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoutClick = async () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem("sb-rodgpnbaewagvfedxbqs-auth-token");
      router.refresh();
      router.push("/user/login");

      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (isAuthenticated && isCustomer) {
    dashboardLink = "/pages/userDashboard";
  } else if (isAuthenticated && Isresturant) {
    dashboardLink = "/pages/resturantDashboard";
  } else {
    dashboardLink = "/user/login";
  }

  const navLinks = [
    { name: "الصفحة الرئيسية", href: "/" },
    { name: "المطاعم", href: "/pages/allResturants" },
    { name: "تعرف علينا", href: "/pages/aboutUs" },
    { name: "تواصل معنا", href: "/pages/contactUs" },
  ];

  if (isAuthenticated) {
    navLinks.splice(2, 0, { name: "لوحة التحكم", href: dashboardLink });
  }

  return (
    <>
      <div className="z-[999]">
      <FirstNav/>
      <header className="bg-[#FFF] w-full flex justify-between items-center !py-3 !px-5 mt-[20px] relative ">
        {/* Logo */}
        <Link href={`/`} className="flex-shrink-0 w-[130px]">
          <Image
            src="/images/logo.png"
            alt="logo icon"
            width={215}
            height={53}
            className="w-full !h-auto sm:h-12 lg:h-[53px] max-w-[150px] sm:max-w-[180px] lg:max-w-[215px]"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex flex-row gap-4 xl:gap-8 items-center text-[#000] text-[16px] xl:text-[18px] font-semibold">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="nav-link cursor-pointer text-black rounded-[100px] min-w-[100px] xl:min-w-[127px] !py-[8px] text-center !px-[5px] duration-300 hover:!bg-orange-400 hover:!text-white transition-all"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Login/Signup Button */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4 max-md:hidden">
            <h1 className="!text-xl !font-bold !text-gray-800">
              ..مرحبا,
              <span className="!text-blue-600">{userName?.slice(0, 10)}</span>
            </h1>
            <a
              onClick={handleLogoutClick}
              className="nav-link cursor-pointer rounded-[100px] !text-white !bg-red-600 min-w-[100px] xl:min-w-[127px] !py-[8px] text-center !px-[5px] text-[14px] lg:text-[16px] hover:!bg-red-700 transition-colors duration-300"
            >
              تسجيل الخروج
            </a>
          </div>
        ) : (
          <Link
            href="/user/login"
            className="hidden nav-link md:block cursor-pointer rounded-[100px] !text-white !bg-[#03081f] min-w-[180px] lg:min-w-[200px] xl:min-w-[234px] !py-[8px] text-center !px-[5px] text-[14px] lg:text-[16px] hover:!bg-[#05102a] transition-colors duration-300"
          >
            تسجيل/انشاء حساب
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden flex items-center justify-center w-10 h-10 text-[#03081f] hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-[0px] right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <Image
            src="/images/logo.png"
            alt="logo icon"
            width={150}
            height={37}
            className="w-auto h-9"
          />
          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-center w-10 h-10 text-[#03081f] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav className="flex flex-col p-5 space-y-2">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="cursor-pointer nav-link decoration-none rounded-[100px] !py-3 !px-4 text-center !text-[#000] text-[16px] font-semibold hover:!bg-orange-400 hover:!text-white transition-all duration-300"
              onClick={toggleMobileMenu}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Login/Signup Button */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4 flex-col">
            <h1 className="!text-lg !font-bold !text-gray-800">
              Welcome,
              <span className="!text-blue-600">{userName?.slice(0, 10)}..</span>
            </h1>
            <a
              onClick={() => {
                handleLogoutClick();
                toggleMobileMenu();
              }}
              className="w-[90%] rounded-[100px] !text-white !bg-red-600 !py-[10px] text-center text-[14px] hover:!bg-red-700 transition-colors duration-300 font-semibold"
            >
              تسجيل الخروج
            </a>
          </div>
        ) : (
          <div className="p-5 border-t border-gray-200 mt-auto flex justify-center">
            <Link
              onClick={toggleMobileMenu}
              href="/user/login"
              className="w-full nav-link cursor-pointer  rounded-[100px] !text-white !bg-[#03081f] !py-3 !px-5 text-center text-[16px] font-medium hover:!bg-[#05102a] transition-colors duration-300"
            >
              تسجيل/انشاء حساب
            </Link>
          </div>
        )}
        </div>
        </div>
    </>
  );
};

export default NavBar;