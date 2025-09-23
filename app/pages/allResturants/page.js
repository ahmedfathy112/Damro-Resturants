"use client";
import AllResApi from "../../components/allResturantsPage/AllResApi";
// import ResHomePagesComponent from "../../components/allResturantsPage/ResHomePagesComponent";
import React, { useEffect, useState } from "react";

const ResTurentHomePages = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="ml-4 text-lg font-semibold text-gray-700"></p>
      </div>
    );
  }
  return (
    <div>
      <AllResApi />
    </div>
  );
};

export default ResTurentHomePages;
