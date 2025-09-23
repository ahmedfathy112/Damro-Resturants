"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/Authcontext";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, userName, logout, isCustomer, Isresturant } =
    useAuth();
  let dashboardLink;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
    { name: "عن الشركة", href: "#" },
    { name: "تواصل معنا", href: "#" },
  ];

  if (isAuthenticated) {
    navLinks.splice(2, 0, { name: "لوحة التحكم", href: dashboardLink });
  }

  return (
    <>
      <header className="bg-[#FFF] w-full flex justify-between items-center !py-3 !px-5 mt-[20px] relative">
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
            <button
              onClick={logout}
              className="nav-link cursor-pointer rounded-[100px] !text-white !bg-red-600 min-w-[100px] xl:min-w-[127px] !py-[8px] text-center !px-[5px] text-[14px] lg:text-[16px] hover:!bg-red-700 transition-colors duration-300"
            >
              تسجيل الخروج
            </button>
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
        className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <Image
            src="/Images/logo.png"
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
            <a
              key={index}
              href={link.href}
              className="cursor-pointer nav-link decoration-none rounded-[100px] !py-3 !px-4 text-center !text-[#000] text-[16px] font-semibold hover:!bg-orange-400 hover:!text-white transition-all duration-300"
              onClick={toggleMobileMenu}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Login/Signup Button */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <h1 className="!text-lg !font-bold !text-gray-800">
              Welcome,
              <span className="!text-blue-600">{userName?.slice(0, 10)}..</span>
            </h1>
            <button
              onClick={logout}
              className="nav-link cursor-pointer rounded-[100px] !text-white !bg-red-600 min-w-[100px] xl:min-w-[127px] !py-[8px] text-center !px-[5px] text-[14px] lg:text-[16px] hover:!bg-red-700 transition-colors duration-300"
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <div className="p-5 border-t border-gray-200 mt-auto">
            <Link
              href="/user/login"
              className="w-full nav-link cursor-pointer rounded-[100px] !text-white !bg-[#03081f] !py-3 !px-5 text-center text-[16px] font-medium hover:!bg-[#05102a] transition-colors duration-300"
            >
              تسجيل/انشاء حساب
            </Link>
          </div>
        )}
      </div>

      {/* Tablet Menu (md screens) - Simplified version */}
      {/* {isAuthenticated ? (
        <h1 className="!text-lg !font-bold !text-gray-800">
          Welcome,
          <span className="!text-blue-600">{userName?.slice(0, 10)}..</span>
        </h1>
      ) : (
        <div className="md:hidden sm:block bg-[#FFF] w-full px-5 py-2">
          <div className="flex justify-center">
            <Link
              href="/user/login"
              className="cursor-pointer nav-link rounded-[100px] !text-white !bg-[#03081f] min-w-[200px] !py-[8px] text-center !px-[5px] text-[14px] hover:!bg-[#05102a] transition-colors duration-300"
            >
              تسجيل/انشاء حساب
            </Link>
          </div>
        </div>
      )} */}
    </>
  );
};

export default NavBar;
