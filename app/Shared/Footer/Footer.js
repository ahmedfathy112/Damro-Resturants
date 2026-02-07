import Link from "next/link";
import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 flex flex-row flex-wrap justify-between py-5 px-7 max-md:flex-col max-md:px-3 max-md:justify-center">
      {/* website logo */}
      <div>
        <Image
          src="/images/logo.webp"
          alt="website logo"
          width={100}
          height={100}
          className="w-[100px] h-[100px] max-md:mx-auto max-md:w-[150px] max-md:h-[150px]"
          // style={{ width: "1/5", height: "auto" }}
        />
      </div>
      {/* quick links */}
      <div className="flex flex-col text-right max-md:text-center">
        <h3 className="text-right !text-white !font-medium !text-2xl !mb-4 underline-offset-1 pb-1.5 max-md:text-center">
          روابط سريعة
        </h3>
        {/* quick links */}
        <div className="flex flex-col text-right max-md:text-center">
          <Link
            href="/"
            className="footer-links !mb-3 !text-gray-400 !font-medium !pb-1.5"
          >
            الصفحة الرئيسية
          </Link>
          <Link
            href="/pages/aboutUs"
            className="footer-links !mb-3 !text-gray-400 !font-medium !pb-1.5"
          >
            ماذا عنا؟
          </Link>
          <Link
            href="/pages/contactUs"
            className="footer-links !mb-3 !text-gray-400 !font-medium !pb-1.5"
          >
            تواصل معنا
          </Link>
        </div>
      </div>
      {/* main links */}
      <div className="flex flex-col text-right max-md:text-center">
        <h3 className="text-right !text-white !font-medium !text-2xl !mb-4 underline-offset-1 pb-1.5 max-md:text-center">
          الروابط الأساسية
        </h3>
        {/* main links */}
        <div className="flex flex-col text-right max-md:text-center">
          <Link
            href="/pages/allResturants"
            className="footer-links !mb-3 !text-gray-400 !font-medium !pb-1.5"
          >
            مطاعمنا
          </Link>
          <Link
            href="/user/login"
            className="footer-links !mb-3 !text-gray-400 !font-medium !pb-1.5"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
