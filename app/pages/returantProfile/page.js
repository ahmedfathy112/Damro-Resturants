import React from "react";
import "../components/resturantPage/ResturentStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ResturentDatails from "../components/resturantPage/ResHome";
import ResturentOffer from "../components/resturantPage/ResOffer";
import Burgers from "../components/resturantPage/Burgers";
import Fries from "../components/resturantPage/Fries";
import ColdDrinks from "../components/resturantPage/ColdDrinks";

const ResturantPage = () => {
  return (
    <div>
      <ResturentDatails />
      <ResturentOffer />
      <Burgers />
      <Fries />
      <ColdDrinks />
    </div>
  );
};

export default ResturantPage;
