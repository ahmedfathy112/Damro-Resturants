"use client";
import React from "react";
import { GoSearch } from "react-icons/go";
import "./ResturentStyle.css";
import AllResApi from "./AllResApi";

const ResHomePagesComponent = () => {
  return (
    <div className="ResHomePagesComponent px-3 py-3 mt-2 text-black" dir="rtl">
      {/* header and search */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <h4 className="font-bold text-3xl m-0">مطاعمنا</h4>
        <div className="flex items-center px-2 py-1 rounded border border-gray-300 max-w-xs">
          <GoSearch size={20} className="ms-2 text-gray-500" />
          <input
            type="text"
            className="p-0 bg-transparent border-0 outline-none focus:ring-0 text-black placeholder-gray-400"
            placeholder="ابحث عن مطعم..."
          />
        </div>
      </div>

      <AllResApi />
    </div>
  );
};

export default ResHomePagesComponent;
