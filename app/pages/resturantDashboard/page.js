"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed } from "lucide-react";

import Sidebar from "../../components/dashboard/resturant/Sidebar";
import OverviewTab from "../../components/dashboard/resturant/OverviewTab";
import OrdersTab from "../../components/dashboard/resturant/OrdersTab";
import ProductsTab from "../../components/dashboard/resturant/ProductsTab";
import PlaceholderTab from "../../components/dashboard/admin/PlaceholderTab";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext";
import Reviews from "../../components/dashboard/resturant/Reviews";
const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { userId, Isresturant } = useAuth();

  // show tabs based on activeTab state
  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab restaurantId={userId} />;
      case "orders":
        return <OrdersTab restaurantId={userId} />;
      case "products":
        return <ProductsTab restaurantId={userId} />;
      case "Reviews":
        return <Reviews restaurantId={userId} />;
      default:
        return (
          <PlaceholderTab
            icon={UtensilsCrossed}
            title="صفحة غير موجودة"
            description="الصفحة المطلوبة غير موجودة"
          />
        );
    }
  };

  const router = useRouter();

  // check if the user is a customer
  useEffect(() => {
    const checkUserType = async () => {
      if (!Isresturant) {
        router.push("/");
      }
    };
    checkUserType();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pr-4 flex flex-row" dir="rtl">
      {/* SideBar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* main content */}
      <main className="p-2 w-full">{renderActiveTab()}</main>
    </div>
  );
};

export default RestaurantDashboard;
