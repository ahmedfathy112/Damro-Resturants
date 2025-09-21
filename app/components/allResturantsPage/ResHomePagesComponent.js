"use client";
import React from "react";
import { GoSearch } from "react-icons/go";
import "./ResturentStyle.css";
import AllResApi from "./AllResApi";
import "bootstrap/dist/css/bootstrap.min.css";

const ResHomePagesComponent = () => {
  return (
    <div
      className="ResHomePagesComponent px-3 py-3 mt-2"
      dir="rtl"
      style={{ color: "black" }}
    >
      {/* header and search */}
      <div
        className="d-flex align-items-center flex-wrap mb-4"
        style={{ justifyContent: "space-between" }}
      >
        <h4 className="fw-bold !text-3xl m-0">مطاعمنا</h4>
        <div
          className="d-flex align-items-center px-2 py-1 rounded"
          style={{ border: "1px solid #ccc", maxWidth: "280px" }}
        >
          <GoSearch size={20} className="ms-2 text-light" />
          <input
            type="text"
            className="form-control p-0"
            placeholder="ابحث عن مطعم..."
            style={{
              border: "none",
              outline: "none",
              boxShadow: "none",
              color: "#000",
            }}
          />
        </div>
      </div>

      <AllResApi />
    </div>
  );
};

export default ResHomePagesComponent;
