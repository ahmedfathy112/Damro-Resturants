"use client";
import React from "react";
import "../../../components/resturantPage/ResturentStyle.css";

import ResturentDatails from "../../../components/resturantPage/ResHome";
// import Burgers from "../../../components/resturantPage/Burgers";
import { useParams } from "next/navigation";
import CommentSec from "../../../components/resturantPage/Comment";
import RestaurantMenu from "../../../components/resturantPage/Burgers";

const ResturantPage = () => {
  const params = useParams();
  const resturantId = params.id;
  console.log(resturantId);
  return (
    <div>
      <ResturentDatails restaurantId={resturantId} />
      <RestaurantMenu restaurantId={resturantId} />
      <CommentSec restaurantId={resturantId} />
    </div>
  );
};

export default ResturantPage;
