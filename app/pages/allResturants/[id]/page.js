"use client";
import React from "react";
import "../../../components/resturantPage/ResturentStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ResturentDatails from "../../../components/resturantPage/ResHome";
import ResturentOffer from "../../../components/resturantPage/ResOffer";
import Burgers from "../../../components/resturantPage/Burgers";
import Fries from "../../../components/resturantPage/Fries";
import ColdDrinks from "../../../components/resturantPage/ColdDrinks";
import { useParams } from "next/navigation";

const ResturantPage = () => {
  const params = useParams();
  const resturantId = params.id;
  console.log(resturantId);
  return (
    <div>
      <ResturentDatails restaurantId={resturantId} />
      {/* <ResturentOffer restaurantId={resturantId} /> */}
      <Burgers restaurantId={resturantId} />
      {/* <Fries restaurantId={resturantId} /> */}
      {/* <ColdDrinks restaurantId={resturantId} /> */}
    </div>
  );
};

export default ResturantPage;
