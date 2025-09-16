import React from "react";
import { IoMdAdd } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";

const ColdDrinks = () => {
  const drinks = [
    {
      id: 1,
      title: "كوكاكولا كبيرة",
      desc: "مشروب غازي منعش يقدم مع ثلج",
      price: "15.00 جنيه إسترليني",
      image: "/Images/Drink.jpg",
    },
    {
      id: 2,
      title: "سبرايت وسط",
      desc: "مشروب غازي بطعم الليمون المنعش",
      price: "12.00 جنيه إسترليني",
      image: "/Images/Drink.jpg",
    },
    {
      id: 3,
      title: "فانتا برتقال",
      desc: "مشروب غازي بطعم البرتقال الفوار",
      price: "13.00 جنيه إسترليني",
      image: "/Images/Drink.jpg",
    },
    {
      id: 4,
      title: "عصير مانجو طبيعي",
      desc: "كوب عصير مانجو طازج وبارد",
      price: "18.00 جنيه إسترليني",
      image: "/Images/Drink.jpg",
    },
    {
      id: 5,
      title: "ليمون بالنعناع",
      desc: "عصير ليمون منعش مع أوراق النعناع",
      price: "20.00 جنيه إسترليني",
      image: "/Images/Drink.jpg",
    },
    {
      id: 6,
      title: "مياه معدنية",
      desc: "زجاجة مياه معدنية باردة",
      price: "8.00 جنيه إسترليني",
      image: "/Images/Drink.jpg",
    },
  ];

  return (
    <div className="mt-5 px-4 pb-3 my-4" style={{ direction: "ltr" }}>
      <h1 className="mb-4 text-end"> قائمة المشروبات الباردة</h1>
      <div className="row g-4">
        {drinks.map((item) => (
          <div className="col-12 col-md-6 col-lg-4" key={item.id}>
            <div className="card position-relative h-100 p-3 shadow">
              <div
                className="d-flex flex-row gap-3 align-items-center"
                style={{ justifyContent: "space-between" }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <div className="text-end">
                  <h5>{item.title}</h5>
                  <p className="text-muted">{item.desc}</p>
                  <strong>{item.price}</strong>
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

export default ColdDrinks;
