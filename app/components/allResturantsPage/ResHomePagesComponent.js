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
        <h4 className="fw-bold !text-3xl m-0">المطاعم المتاحه</h4>
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

      {/* choose type  */}
      <nav className="mt-5">
        <ul
          className="p-0 m-0 d-flex flex-wrap gap-3"
          style={{ listStyleType: "none" }}
        >
          <li>
            <button className="nav-btn">الكل</button>
          </li>
          <li>
            <button className="nav-btn">مطاعم مصرية</button>
          </li>
          <li>
            <button className="nav-btn">مطاعم سورية</button>
          </li>
          <li>
            <button className="nav-btn">بيتزا</button>
          </li>
          <li>
            <button className="nav-btn">برجر</button>
          </li>
          <li>
            <button className="nav-btn">مأكولات بحرية</button>
          </li>
          <li>
            <button className="nav-btn">حلويات</button>
          </li>
        </ul>
      </nav>

      <div
        className="d-flex align-items-center mt-5 flex-wrap gap-3"
        style={{ justifyContent: "space-between" }}
      >
        <p className="fw-semibold m-0">اختر المطاعم حسب:</p>

        <div className="dropdown">
          <button
            className="btn btn-outline-light dropdown-toggle"
            type="button"
            id="dropdownMenuLink"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            الفلاتر
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <li>
              <a className="dropdown-item" href="#">
                الأعلى تقييماً
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                الأقرب
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                أسعار مناسبة
              </a>
            </li>
          </ul>
        </div>
      </div>

      <AllResApi />
    </div>
  );
};

export default ResHomePagesComponent;
