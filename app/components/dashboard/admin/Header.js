// components/admin/Header.jsx
import { Bell } from "lucide-react";

const Header = ({ activeTab }) => {
  const getPageTitle = () => {
    const titles = {
      overview: "نظرة عامة",
      restaurants: "إدارة المطاعم",
      customers: "إدارة العملاء",
      orders: "إدارة الطلبات",
      reviews: "التقييمات والشكاوى",
      analytics: "التقارير والإحصائيات",
    };
    return titles[activeTab] || "لوحة التحكم";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600 mt-1">إدارة ومتابعة جميع عمليات المنصة</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
