import React from "react";
import "./ResturentStyle.css";
import { FaStar } from "react-icons/fa";
import { MdPlaylistAddCheck } from "react-icons/md";
import { IoMdBicycle } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";

const ResturentDatails = () => {
  return (
    <div className="resturentdetails">
      <div className="overlay"></div>

      <div className="restop d-flex flex-column flex-md-row align-items-center h-100 p-3 gap-4">
        <div className="ResturentdetailsText text-white text-end text-md-end">
          <h2>أنا بحبها !</h2>
          <br />
          <h1>ماكدونالدز شرق لندن</h1>

          <div className="d-flex flex-column flex-sm-row gap-3 mt-5">
            <button className="d-flex align-items-center gap-3 btn btn-outline-light p-3">
              <MdPlaylistAddCheck style={{ fontSize: "24px" }} />
              <span className="fs-6">الحد الأدنى للطلب: 12 جنيه إسترليني</span>
            </button>

            <button className="d-flex align-items-center gap-3 btn btn-outline-light p-3">
              <IoMdBicycle style={{ fontSize: "24px" }} />
              <span className="fs-6">وقت التوصيل: 20-25 دقيقة</span>
            </button>
          </div>
        </div>

        <div className="Resimage bg-white p-3 rounded shadow position-relative">
          <img
            src="/Images/ResDeHome.png"
            alt="صورة تفاصيل المطعم"
            className="img-fluid rounded"
          />

          <div className="rating-box">
            <h4 className="mb-1">3.4</h4>
            <div className="d-flex justify-content-center gap-1">
              <FaStar style={{ color: "gold" }} />
              <FaStar style={{ color: "gold" }} />
              <FaStar style={{ color: "gold" }} />
              <FaStar style={{ color: "gold" }} />
              <FaStar style={{ color: "#ccc" }} />
            </div>
            <p className="mt-1 mb-0" style={{ fontSize: "12px" }}>
              1,360 تقييم
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResturentDatails;
