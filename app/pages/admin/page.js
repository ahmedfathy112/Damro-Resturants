"use client";

import { useState } from "react";
import { Users, ShoppingCart, MessageSquare, TrendingUp } from "lucide-react";

import PlaceholderTab from "../../components/dashboard/admin/PlaceholderTab";
import OverviewTab from "../../components/dashboard/admin/OverView";
import RestaurantsTab from "../../components/dashboard/admin/Resturants";
import Sidebar from "../../components/dashboard/admin/SideBar";
import Header from "../../components/dashboard/admin/Header";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // بيانات وهمية للعرض التوضيحي
  const stats = {
    totalRestaurants: 125,
    activeRestaurants: 98,
    pendingApproval: 12,
    totalCustomers: 2543,
    totalOrders: 8932,
    totalRevenue: 125670,
    avgRating: 4.3,
    newRegistrations: 23,
  };

  const pendingRestaurants = [
    {
      id: 1,
      name: "مطعم الذواقة",
      owner: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+20123456789",
      registrationDate: "2024-01-15",
      documents: ["ترخيص تجاري", "بطاقة ضريبية"],
    },
    {
      id: 2,
      name: "بيتزا رويال",
      owner: "سارة علي",
      email: "sara@example.com",
      phone: "+20123456790",
      registrationDate: "2024-01-14",
      documents: ["ترخيص تجاري", "شهادة سلامة غذائية"],
    },
    {
      id: 3,
      name: "مطعم البحر الأبيض",
      owner: "محمد حسن",
      email: "mohamed@example.com",
      phone: "+20123456791",
      registrationDate: "2024-01-13",
      documents: ["ترخيص تجاري", "شهادة سلامة غذائية"],
    },
  ];

  const recentOrders = [
    {
      id: "#12345",
      customer: "محمد أحمد",
      restaurant: "مطعم الذواقة",
      amount: 120,
      status: "تم التسليم",
    },
    {
      id: "#12344",
      customer: "فاطمة سعد",
      restaurant: "بيتزا رويال",
      amount: 85,
      status: "قيد التحضير",
    },
    {
      id: "#12343",
      customer: "علي حسن",
      restaurant: "مطعم البحر",
      amount: 200,
      status: "جديد",
    },
    {
      id: "#12342",
      customer: "نورا محمد",
      restaurant: "مطعم الذواقة",
      amount: 150,
      status: "تم التسليم",
    },
    {
      id: "#12341",
      customer: "أحمد علي",
      restaurant: "بيتزا رويال",
      amount: 95,
      status: "ملغى",
    },
  ];

  const notifications = [
    {
      id: 1,
      message: "طلب موافقة جديد من مطعم الذواقة",
      time: "منذ 5 دقائق",
      type: "approval",
    },
    {
      id: 2,
      message: "شكوى جديدة من عميل",
      time: "منذ 15 دقيقة",
      type: "complaint",
    },
    {
      id: 3,
      message: "تم تسجيل مطعم جديد",
      time: "منذ ساعة",
      type: "registration",
    },
    {
      id: 4,
      message: "تم إكمال طلب #12345",
      time: "منذ ساعتين",
      type: "order",
    },
    {
      id: 5,
      message: "تقييم جديد لمطعم بيتزا رويال",
      time: "منذ 3 ساعات",
      type: "review",
    },
  ];

  // دالة لعرض المحتوى حسب التبويب النشط
  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            stats={stats}
            pendingRestaurants={pendingRestaurants}
            recentOrders={recentOrders}
            notifications={notifications}
          />
        );
      case "restaurants":
        return (
          <RestaurantsTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            pendingRestaurants={pendingRestaurants}
          />
        );
      case "customers":
        return (
          <PlaceholderTab
            icon={Users}
            title="إدارة العملاء"
            description="هذا القسم قيد التطوير..."
          />
        );
      case "orders":
        return (
          <PlaceholderTab
            icon={ShoppingCart}
            title="إدارة الطلبات"
            description="هذا القسم قيد التطوير..."
          />
        );
      case "reviews":
        return (
          <PlaceholderTab
            icon={MessageSquare}
            title="التقييمات والشكاوى"
            description="هذا القسم قيد التطوير..."
          />
        );
      case "analytics":
        return (
          <PlaceholderTab
            icon={TrendingUp}
            title="التقارير والإحصائيات"
            description="هذا القسم قيد التطوير..."
          />
        );
      default:
        return (
          <PlaceholderTab
            icon={Users}
            title="صفحة غير موجودة"
            description="الصفحة المطلوبة غير موجودة"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pr-64" dir="rtl">
      {/* الشريط الجانبي */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />

      {/* الهيدر */}
      <Header activeTab={activeTab} />

      {/* المحتوى الرئيسي */}
      <main className="p-6">{renderActiveTab()}</main>
    </div>
  );
};

export default AdminDashboard;
