"use client";
import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Phone,
  User,
  CreditCard,
  Settings,
  Bell,
  Search,
  Filter,
  Eye,
  Package,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Component للإحصائيات السريعة
const StatsCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Component للطلبات الحالية
const CurrentOrders = () => {
  const currentOrders = [
    {
      id: "ORD-001",
      restaurant: "مطعم الشام",
      items: ["برجر دجاج", "بطاطس مقلية", "كوكا كولا"],
      total: 45.5,
      status: "preparing",
      estimatedTime: "25 دقيقة",
      orderTime: "12:30 ص",
    },
    {
      id: "ORD-002",
      restaurant: "بيتزا إيطاليا",
      items: ["بيتزا مارجريتا كبيرة", "عصير برتقال"],
      total: 62.0,
      status: "confirmed",
      estimatedTime: "35 دقيقة",
      orderTime: "1:15 ص",
    },
  ];

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        text: "في الانتظار",
        color: "text-yellow-600 bg-yellow-100",
        icon: Clock,
      },
      confirmed: {
        text: "تم التأكيد",
        color: "text-blue-600 bg-blue-100",
        icon: CheckCircle,
      },
      preparing: {
        text: "قيد التحضير",
        color: "text-orange-600 bg-orange-100",
        icon: Package,
      },
      ready: {
        text: "جاهز للتسليم",
        color: "text-green-600 bg-green-100",
        icon: CheckCircle,
      },
      delivered: {
        text: "تم التسليم",
        color: "text-green-600 bg-green-100",
        icon: CheckCircle,
      },
      cancelled: {
        text: "ملغي",
        color: "text-red-600 bg-red-100",
        icon: XCircle,
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">الطلبات الحالية</h2>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {currentOrders.length} طلب نشط
        </span>
      </div>

      <div className="space-y-4">
        {currentOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">
                      {order.restaurant}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.text}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <p className="mb-1">رقم الطلب: {order.id}</p>
                    <p className="mb-1">وقت الطلب: {order.orderTime}</p>
                    <p>الوقت المتوقع: {order.estimatedTime}</p>
                  </div>

                  <div className="text-sm text-gray-500">
                    {order.items.join(" • ")}
                  </div>
                </div>

                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-900">
                    {order.total.toFixed(2)} ر.س
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Component لسجل الطلبات السابقة
const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const orderHistory = [
    {
      id: "ORD-098",
      restaurant: "كنتاكي",
      items: ["وجبة زنجر", "كول سلو", "بيبسي"],
      total: 38.75,
      status: "delivered",
      date: "2025-01-10",
      rating: 5,
    },
    {
      id: "ORD-097",
      restaurant: "مطعم المحيط",
      items: ["سمك مشوي", "أرز بسمتي", "سلطة"],
      total: 55.2,
      status: "delivered",
      date: "2025-01-08",
      rating: 4,
    },
    {
      id: "ORD-096",
      restaurant: "بيتزا هت",
      items: ["بيتزا سوبر سوبريم وسط"],
      total: 42.0,
      status: "cancelled",
      date: "2025-01-05",
      rating: null,
    },
  ];

  const tabs = [
    { id: "all", label: "جميع الطلبات", count: orderHistory.length },
    {
      id: "delivered",
      label: "مكتملة",
      count: orderHistory.filter((o) => o.status === "delivered").length,
    },
    {
      id: "cancelled",
      label: "ملغية",
      count: orderHistory.filter((o) => o.status === "cancelled").length,
    },
  ];

  const filteredOrders = orderHistory.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      order.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">سجل الطلبات</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="البحث في الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-gray-900">
                    {order.restaurant}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status === "delivered" ? "مكتمل" : "ملغي"}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">رقم الطلب: {order.id}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  {order.items.join(" • ")}
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900">
                    {order.total.toFixed(2)} ر.س
                  </p>
                  <div className="flex items-center gap-2">
                    {order.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < order.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      إعادة الطلب
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component لمعلومات الملف الشخصي
const ProfileInfo = () => {
  const userProfile = {
    name: "أحمد محمد",
    email: "ahmed.mohamed@email.com",
    phone: "+966501234567",
    address: "شارع الملك فهد، الرياض، المملكة العربية السعودية",
    joinDate: "يناير 2024",
    totalOrders: 47,
    favoriteRestaurants: ["مطعم الشام", "كنتاكي", "بيتزا إيطاليا"],
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">الملف الشخصي</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
          <Settings className="w-4 h-4" />
          تعديل
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {userProfile.name}
            </h3>
            <p className="text-gray-600">عضو منذ {userProfile.joinDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Phone className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">رقم الهاتف</p>
              <p className="font-medium text-gray-900">{userProfile.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ShoppingBag className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي الطلبات</p>
              <p className="font-medium text-gray-900">
                {userProfile.totalOrders} طلب
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <MapPin className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">العنوان</p>
            <p className="font-medium text-gray-900">{userProfile.address}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">
            المطاعم المفضلة
          </p>
          <div className="flex flex-wrap gap-2">
            {userProfile.favoriteRestaurants.map((restaurant, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {restaurant}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component للإعدادات والتفضيلات
const SettingsPanel = () => {
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  });

  const [paymentMethods] = useState([
    { id: 1, type: "card", last4: "1234", brand: "Visa", isDefault: true },
    {
      id: 2,
      type: "card",
      last4: "5678",
      brand: "Mastercard",
      isDefault: false,
    },
  ]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        الإعدادات والتفضيلات
      </h2>

      <div className="space-y-6">
        {/* إعدادات الإشعارات */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            إعدادات الإشعارات
          </h3>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => {
              const labels = {
                orderUpdates: "تحديثات الطلبات",
                promotions: "العروض والخصومات",
                newsletter: "النشرة الإخبارية",
              };

              return (
                <label key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{labels[key]}</span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setNotifications((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* طرق الدفع */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            طرق الدفع
          </h3>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {method.brand} •••• {method.last4}
                    </p>
                    {method.isDefault && (
                      <span className="text-xs text-green-600">
                        البطاقة الافتراضية
                      </span>
                    )}
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  تعديل
                </button>
              </div>
            ))}
            <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors">
              + إضافة بطاقة جديدة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// المكون الرئيسي للـ Dashboard
const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const menuItems = [
    { id: "overview", label: "نظرة عامة", icon: ShoppingBag },
    { id: "current", label: "الطلبات الحالية", icon: Clock },
    { id: "history", label: "سجل الطلبات", icon: Package },
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="الطلبات الحالية"
                value="2"
                icon={Clock}
                color="orange"
              />
              <StatsCard
                title="الطلبات المكتملة"
                value="47"
                icon={CheckCircle}
                color="green"
              />
              <StatsCard
                title="إجمالي المبلغ"
                value="1,247 ر.س"
                icon={CreditCard}
                color="blue"
              />
              <StatsCard
                title="المطاعم المفضلة"
                value="3"
                icon={Star}
                color="red"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CurrentOrders />
              <ProfileInfo />
            </div>
          </div>
        );
      case "current":
        return <CurrentOrders />;
      case "history":
        return <OrderHistory />;
      case "profile":
        return <ProfileInfo />;
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };
  const router = useRouter();

  // check if the user is a customer
  useEffect(() => {
    const checkUserType = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!(await isCustomer(user.id))) {
        router.push("/");
      }
    };
    checkUserType();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-l border-gray-200 min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
            <p className="text-sm text-gray-600 mt-1">مرحباً أحمد محمد</p>
          </div>

          <nav className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-right hover:bg-gray-50 transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-700 border-l-3 border-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserDashboard;
