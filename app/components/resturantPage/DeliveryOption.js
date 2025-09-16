"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaWalking } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";

const DeliveryOption = () => {
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  if (!visible) return null;
  return (
    <div
      className="DeliveryOption d-flex justify-content-center align-items-center w-100"
      style={{ height: "100vh", position: "relative" }}
    >
      <div
        className="d-flex flex-column justify-content-center align-items-center p-5 position-relative bg-light"
        style={{
          gap: "15px",
          border: "1px solid lightgray",
          borderRadius: "10px",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <button
          className="btn btn-dark text-light position-absolute d-flex align-items-center justify-content-center"
          style={{
            top: "10px",
            right: "10px",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
          }}
          onClick={() => setVisible(false)}
        >
          <IoMdClose style={{ fontSize: "28px" }} />
        </button>

        <h1 className="text-center">اطلب الآن</h1>
        <p className="text-center">الحد الأدنى للتوصيل هو 10$</p>

        <button className="btn btn-dark px-4 d-flex mt-3 gap-3 align-items-center">
          <CiDeliveryTruck size={22} /> توصيل الطلب
        </button>

        <button className="btn btn-warning px-4 d-flex mt-3 gap-4 align-items-center">
          <FaWalking size={22} /> سآتي للاستلام
        </button>

        <span className="mt-3">أو</span>
        <span
          className="mt-2 text-decoration-none cursor-pointer text-primary"
          style={{ cursor: "pointer" }}
          onClick={() => router.back()} // ← هنا برضو بيرجع صفحة لورا
        >
          الرجوع للصفحة الرئيسية
        </span>
      </div>
    </div>
  );
};

export default DeliveryOption;
