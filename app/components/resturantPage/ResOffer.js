import React from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";

const ResturentOffer = () => {
  return (
    <div className="ResOffer mt-5 pt-3  " style={{ direction: "rtl" }}>
      <div className="ResOfferTop d-flex justify-content-between align-items-center gap-1 px-3">
        <h2>جميع العروض من ماكدونالدز شرق لندن</h2>
        <div
          className="d-flex align-items-center"
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
        <div className="whitespace-wrapper  ">
          <div
            className="ResOfferBar-3 d-flex gap-3 mt-4 py-3 align-items-center flex-nowrap px-4"
            style={{
              borderRadius: "5px",
              backgroundColor: "#FC8A06",
              overflowX: "auto",
              justifyContent: "center",
            }}
          >
            <button className="btn btn-outline-light fs-6">الكل</button>
            <button className="btn btn-outline-light">برجر</button>
            <button className="btn btn-outline-light">بطاطس</button>
            <button className="btn btn-outline-light">سناكس</button>
            <button className="btn btn-outline-light">سلطات</button>
            <button className="btn btn-outline-light whitespace-nowrap">
              مشروبات باردة
            </button>
            <button className="btn btn-outline-light whitespace-nowrap">
              هابي ميل®
            </button>
          </div>
        </div>

        <div className="ResOfferCards mt-4 pb-4">
          <div className="row ">
            <div className="col-md-6 col-lg-4  col-sm-12  mt-4">
              <div
                className="card position-relative overflow-hidden"
                style={{ borderRadius: "10px" }}
              >
                <img
                  src="/images/ResDeHome.png"
                  alt="..."
                  className="card-img"
                  style={{ height: "400px", objectFit: "cover" }}
                />

                <div
                  className="card-img-overlay d-flex flex-column justify-content-end text-white p-3"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                >
                  <h5 className="card-title">ماكدونالدز شرق لندن</h5>
                  <p className="card-text">خصم على أول طلب</p>
                  <div className="fw-bold offer">- 20%</div>
                </div>

                <button className="ResOfferCardsButton">
                  <i className="i">
                    <IoMdAdd />
                  </i>
                </button>
              </div>
            </div>
            {/* col-2 */}
            <div className="col-md-6 col-lg-4   col-sm-12 mt-4">
              <div
                className="card position-relative overflow-hidden"
                style={{ borderRadius: "10px" }}
              >
                <img
                  src="/images/ResDeHome.png"
                  alt="..."
                  className="card-img"
                  style={{ height: "400px", objectFit: "cover" }}
                />

                <div
                  className="card-img-overlay d-flex flex-column justify-content-end text-white p-3"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                >
                  <h5 className="card-title">ماكدونالدز شرق لندن</h5>
                  <p className="card-text">خصم على أول طلب</p>
                  <div className="fw-bold offer">- 20%</div>
                </div>

                <button className="ResOfferCardsButton">
                  <i className="i">
                    <IoMdAdd />
                  </i>
                </button>
              </div>
            </div>
            {/* col-3 */}
            <div className="col-md-6 col-lg-4 col-sm-12 mt-4">
              <div
                className="card position-relative overflow-hidden"
                style={{ borderRadius: "10px" }}
              >
                <img
                  src="/images/ResDeHome.png"
                  alt="..."
                  className="card-img"
                  style={{ height: "400px", objectFit: "cover" }}
                />

                <div
                  className="card-img-overlay d-flex flex-column justify-content-end text-white p-3"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                >
                  <h5 className="card-title">ماكدونالدز شرق لندن</h5>
                  <p className="card-text">خصم على أول طلب</p>
                  <div className="fw-bold offer">- 20%</div>
                </div>

                <button className="ResOfferCardsButton">
                  <i className="i">
                    <IoMdAdd />
                  </i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResturentOffer;
