import React from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";

const ResturentOffer = () => {
  return (
    <div className="ResOffer mt-5 pt-3" style={{ direction: "rtl" }}>
      <div className="ResOfferTop flex justify-between items-center gap-1 px-3">
        <h2>جميع العروض من ماكدونالدز شرق لندن</h2>
        <div
          className="flex items-center"
          style={{
            border: "1px solid #ccc",
            padding: "5px 10px",
            borderRadius: "5px",
            direction: "rtl",
            gap: "8px",
          }}
        >
          <CiSearch style={{ fontSize: "20px" }} />

          <input
            type="text"
            placeholder="ابحث عن العروض ..."
            className="form-control"
            style={{
              border: "none",
              outline: "none",
              boxShadow: "none",
              flex: 1,
              minWidth: "0",
            }}
          />
        </div>
      </div>

      <div className="ResOffer mt-4 px-3">
        <div className="whitespace-wrapper">
          <div
            className="ResOfferBar-3 flex gap-3 mt-4 py-3 items-center overflow-x-auto px-4 rounded"
            style={{
              backgroundColor: "#FC8A06",
              justifyContent: "center",
            }}
          >
            <button className="border border-white text-white px-3 py-1 rounded text-sm font-medium hover:bg-white hover:text-gray-800 transition-colors duration-200">
              الكل
            </button>
            <button className="border border-white text-white px-3 py-1 rounded text-sm font-medium hover:bg-white hover:text-gray-800 transition-colors duration-200">
              برجر
            </button>
            <button className="border border-white text-white px-3 py-1 rounded text-sm font-medium hover:bg-white hover:text-gray-800 transition-colors duration-200">
              بطاطس
            </button>
            <button className="border border-white text-white px-3 py-1 rounded text-sm font-medium hover:bg-white hover:text-gray-800 transition-colors duration-200">
              سناكس
            </button>
            <button className="border border-white text-white px-3 py-1 rounded text-sm font-medium hover:bg-white hover:text-gray-800 transition-colors duration-200">
              سلطات
            </button>
            <button className="border border-white text-white px-3 py-1 rounded text-sm font-medium hover:bg-white hover:text-gray-800 transition-colors duration-200 whitespace-nowrap">
              مشروبات باردة
            </button>
            <button className="border border-white text-white px-3 py-1 rounded text-sm font-medium hover:bg-white hover:text-gray-800 transition-colors duration-200 whitespace-nowrap">
              هابي ميل®
            </button>
          </div>
        </div>

        <div className="ResOfferCards mt-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mt-4">
                <div
                  className="relative overflow-hidden rounded-lg"
                  style={{ borderRadius: "10px" }}
                >
                  <Image
                    src="/images/ResDeHome.webp"
                    alt="..."
                    width={1200}
                    height={600}
                    className="w-full h-80 object-cover"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "auto",
                    }}
                  />

                  <div
                    className="absolute inset-0 flex flex-col justify-end text-white p-3"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                  >
                    <h5 className="text-lg">ماكدونالدز شرق لندن</h5>
                    <p className="text-sm">خصم على أول طلب</p>
                    <div className="font-bold offer">- 20%</div>
                  </div>

                  <button className="ResOfferCardsButton">
                    <i className="i">
                      <IoMdAdd />
                    </i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResturentOffer;
