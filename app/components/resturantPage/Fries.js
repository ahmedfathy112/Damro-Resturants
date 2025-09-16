import React from "react";
import { IoMdAdd } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";

const Fries = () => {
  const fries = [
    {
      id: 1,
      title: "بطاطس مقلية مع برجر تشيز",
      desc: "1 ماك تشيكن™، 1 بيج ماك™، 1 رويال تشيز برجر، 3 بطاطس وسط",
      price: "23.10 جنيه إسترليني",
      image: "/Images/food.jpg",
    },
    {
      id: 2,
      title: "بطاطس كيرلي مع صوص خاص",
      desc: "2 بطاطس كيرلي، صوص باربكيو + صوص جبنة",
      price: "15.50 جنيه إسترليني",
      image: "/Images/food.jpg",
    },
    {
      id: 3,
      title: "بطاطس بالجبنة و الهالبينو",
      desc: "بطاطس وسط مع جبنة شيدر + قطع هالبينو",
      price: "18.00 جنيه إسترليني",
      image: "/Images/food.jpg",
    },
    {
      id: 4,
      title: "وجبة بطاطس عائلية",
      desc: "5 بطاطس كبيرة مع 3 صوصات متنوعة",
      price: "40.00 جنيه إسترليني",
      image: "/Images/food.jpg",
    },
    {
      id: 5,
      title: "بطاطس وناجز",
      desc: "بطاطس وسط مع 6 قطع ناجتس دجاج",
      price: "22.00 جنيه إسترليني",
      image: "/Images/food.jpg",
    },
    {
      id: 6,
      title: "بطاطس كلاسيك",
      desc: "بطاطس مقلية وسط",
      price: "10.00 جنيه إسترليني",
      image: "/Images/food.jpg",
    },
  ];

  return (
    <div className="mt-5  px-4 pb-3 my-4">
      <h1 className="mb-4 text-end"> قائمة البطاطس</h1>
      <div className="row g-4">
        {fries.map((item) => (
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

export default Fries;
