// pages/restaurant/dashboard.js أو app/restaurant/dashboard/page.js

"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed, Star, BarChart3, Package } from "lucide-react";

// استيراد المكونات
import Sidebar from "../../components/dashboard/resturant/Sidebar";
import Header from "../../components/dashboard/resturant/Header";
import OverviewTab from "../../components/dashboard/resturant/OverviewTab";
import OrdersTab from "../../components/dashboard/resturant/OrdersTab";
import ProductsTab from "../../components/dashboard/resturant/ProductsTab";
import PlaceholderTab from "../../components/dashboard/admin/PlaceholderTab";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext";
const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("الجميع");
  const { userId } = useAuth();
  console.log(userId);

  // بيانات وهمية للمطعم
  const stats = {
    todayOrders: 24,
    newOrders: 5,
    preparingOrders: 3,
    deliveredOrders: 16,
    cancelledOrders: 2,
    todayRevenue: 1850,
    monthlyRevenue: 45200,
    averageRating: 4.3,
    totalReviews: 127,
    avgPreparationTime: 25,
  };

  // بيانات الطلبات الحديثة
  const recentOrders = [
    {
      id: "#ORD001",
      customer: "أحمد محمد",
      time: "منذ 5 دقائق",
      amount: 120,
      status: "جديد",
    },
    {
      id: "#ORD002",
      customer: "فاطمة سعد",
      time: "منذ 15 دقيقة",
      amount: 85,
      status: "قيد التحضير",
    },
    {
      id: "#ORD003",
      customer: "محمد علي",
      time: "منذ 30 دقيقة",
      amount: 200,
      status: "جاهز",
    },
    {
      id: "#ORD004",
      customer: "سارة أحمد",
      time: "منذ ساعة",
      amount: 95,
      status: "تم التسليم",
    },
  ];

  // بيانات الطلبات التفصيلية
  const orders = [
    {
      id: "#ORD001",
      date: "2024-09-14",
      time: "12:30 ص",
      status: "جديد",
      total: 120,
      customer: {
        name: "أحمد محمد",
        phone: "+20123456789",
        address: "شارع الجمهورية، المنصورة، الدقهلية",
      },
      items: [
        { name: "برجر دجاج", quantity: 2, price: 50, notes: "بدون خس" },
        { name: "بطاطس مقلية", quantity: 1, price: 20 },
      ],
      estimatedTime: 25,
    },
    {
      id: "#ORD002",
      date: "2024-09-14",
      time: "12:15 ص",
      status: "قيد التحضير",
      total: 85,
      customer: {
        name: "فاطمة سعد",
        phone: "+20123456790",
        address: "شارع البحر، دمنهور، البحيرة",
      },
      items: [
        { name: "بيتزا مارجريتا", quantity: 1, price: 65 },
        { name: "كوكاكولا", quantity: 1, price: 20 },
      ],
      estimatedTime: 15,
    },
    {
      id: "#ORD003",
      date: "2024-09-14",
      time: "11:45 ص",
      status: "جاهز للتسليم",
      total: 200,
      customer: {
        name: "محمد علي",
        phone: "+20123456791",
        address: "شارع النصر، كفر الشيخ",
      },
      items: [
        { name: "وجبة فراخ مشوي", quantity: 1, price: 80 },
        { name: "سلطة خضراء", quantity: 1, price: 25 },
        { name: "أرز بسمتي", quantity: 2, price: 30 },
        { name: "مياه معدنية", quantity: 2, price: 15 },
      ],
      estimatedTime: 0,
    },
  ];

  // بيانات المنتجات
  const products = [
    {
      id: 1,
      name: "برجر دجاج كلاسيك",
      description: "برجر دجاج طازج مع خس وطماطم وصلصة خاصة",
      price: 45,
      category: "الأطباق الرئيسية",
      image: "/Images/food.png",
      isAvailable: true,
      rating: 4.5,
      ordersCount: 156,
      preparationTime: 15,
    },
    {
      id: 2,
      name: "بيتزا مارجريتا",
      description: "بيتزا إيطالية كلاسيكية بالطماطم والموزاريلا والريحان",
      price: 65,
      category: "الأطباق الرئيسية",
      image: "/Images/food.png",
      isAvailable: true,
      rating: 4.3,
      ordersCount: 203,
      preparationTime: 20,
    },
    {
      id: 3,
      name: "سلطة قيصر",
      description: "سلطة خضراء مع دجاج مشوي وصلصة قيصر",
      price: 35,
      category: "المقبلات",
      image: "/Images/food.png",
      isAvailable: false,
      rating: 4.1,
      ordersCount: 89,
      preparationTime: 10,
    },
    {
      id: 4,
      name: "تشيز كيك الفراولة",
      description: "تشيز كيك كريمي بالفراولة الطازجة",
      price: 30,
      category: "الحلويات",
      image: "/Images/food.png",
      isAvailable: true,
      rating: 4.7,
      ordersCount: 124,
      preparationTime: 5,
    },
    {
      id: 5,
      name: "عصير برتقال طازج",
      description: "عصير برتقال طبيعي 100%",
      price: 15,
      category: "المشروبات",
      image: "/Images/Drink.png",
      isAvailable: true,
      rating: 4.2,
      ordersCount: 78,
      preparationTime: 3,
    },
    {
      id: 6,
      name: "مشروم سوتيه",
      description: "مشروم طازج مطبوخ بالزبدة والأعشاب",
      price: 25,
      category: "المقبلات",
      image: "/Images/food.png",
      isAvailable: true,
      rating: 4.0,
      ordersCount: 45,
      preparationTime: 12,
    },
  ];

  // الإشعارات
  const notifications = [
    {
      id: 1,
      message: "طلب جديد #ORD001",
      time: "منذ 5 دقائق",
      type: "order",
    },
    {
      id: 2,
      message: "تم الدفع للطلب #ORD002",
      time: "منذ 15 دقيقة",
      type: "payment",
    },
    {
      id: 3,
      message: "تقييم جديد من أحمد محمد",
      time: "منذ 30 دقيقة",
      type: "review",
      customer: "أحمد محمد",
      rating: 5,
      comment: "طعم رائع وخدمة ممتازة، أنصح بالتجربة",
    },
    {
      id: 4,
      message: "تقييم جديد من فاطمة سعد",
      time: "منذ ساعة",
      type: "review",
      customer: "فاطمة سعد",
      rating: 4,
      comment: "الطعام لذيذ لكن التوصيل تأخر قليلاً",
    },
    {
      id: 5,
      message: "مبيعات اليوم تجاوزت الهدف",
      time: "منذ ساعتين",
      type: "achievement",
    },
  ];

  // دالة لعرض المحتوى حسب التبويب النشط
  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            restaurantId={userId}
            stats={stats}
            recentOrders={recentOrders}
            notifications={notifications}
          />
        );
      case "orders":
        return (
          <OrdersTab
            restaurantId={userId}
            orders={orders}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        );
      case "products":
        return (
          <ProductsTab
            restaurantId={userId}
            products={products}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        );
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (await isCustomer(user.id)) {
        router.push("/");
      }
    };
    checkUserType();
  }, []);

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

export default RestaurantDashboard;
