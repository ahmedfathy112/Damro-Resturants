import React from "react";
import { IoMdAdd } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";

const Burgers = () => {
  const burgers = [
    {
      id: 1,
      title: "رويال تشيز برجر مع بطاطس إضافية",
      desc: "1 ماك تشيكن™، 1 بيج ماك™، 1 رويال تشيز برجر، 3 وسط",
      price: "23.10 جنيه إسترليني",
      image: "/Images/ResDeHome.png",
    },
    {
      id: 2,
      title: "رويال تشيز برجر مع بطاطس إضافية",
      desc: "1 ماك تشيكن™، 1 بيج ماك™، 1 رويال تشيز برجر، 3 وسط",
      price: "23.10 جنيه إسترليني",
      image: "/Images/ResDeHome.png",
    },
    {
      id: 3,
      title: "رويال تشيز برجر مع بطاطس إضافية",
      desc: "1 ماك تشيكن™، 1 بيج ماك™، 1 رويال تشيز برجر، 3 وسط",
      price: "23.10 جنيه إسترليني",
      image: "/Images/ResDeHome.png",
    },
    {
      id: 4,
      title: "رويال تشيز برجر مع بطاطس إضافية",
      desc: "1 ماك تشيكن™، 1 بيج ماك™، 1 رويال تشيز برجر، 3 وسط",
      price: "23.10 جنيه إسترليني",
      image: "/Images/ResDeHome.png",
    },
    {
      id: 5,
      title: "رويال تشيز برجر مع بطاطس إضافية",
      desc: "1 ماك تشيكن™، 1 بيج ماك™، 1 رويال تشيز برجر، 3 وسط",
      price: "23.10 جنيه إسترليني",
      image: "/Images/ResDeHome.png",
    },
    {
      id: 6,
      title: "رويال تشيز برجر مع بطاطس إضافية",
      desc: "1 ماك تشيكن™، 1 بيج ماك™، 1 رويال تشيز برجر، 3 وسط",
      price: "23.10 جنيه إسترليني",
      image: "/Images/ResDeHome.png",
    },
  ];

  return (
    <div className=" mt-3 px-4 pb-3 my-4" style={{ overflow: "hodden " }}>
      <h1 className="mb-4 text-end"> قائمة البرجر</h1>
      <div className="row g-4">
        {burgers.map((burger) => (
          <div className="col-12 col-md-6 col-lg-4" key={burger.id}>
            <div className="card position-relative h-100 p-3 shadow">
              <div
                className="d-flex flex-row gap-3 align-items-center"
                style={{ justifyContent: "space-between" }}
              >
                <img
                  src={burger.image}
                  alt={burger.title}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <div className="text-end">
                  <h5>{burger.title}</h5>
                  <p className="text-muted">{burger.desc}</p>
                  <strong>{burger.price}</strong>
                </div>
              </div>

              <button
                className="add"
                style={{
                  position: "absolute",
                  left: "0",
                  bottom: "0",
                  backgroundColor: " rgb(256, 256, 256, 0.9)",
                  color: "#000",
                  borderRadius: "0 24px 0 0",
                  padding: "15px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                }}
              >
                <IoMdAdd size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Burgers;
