// components/restaurant/Header.jsx
import { Bell, Eye } from "lucide-react";

const Header = ({ activeTab }) => {
  const getPageTitle = () => {
    const titles = {
      overview: "نظرة عامة",
      orders: "إدارة الطلبات",
      products: "إدارة المنتجات",
      categories: "إدارة الفئات",
      reviews: "التقييمات",
      analytics: "التقارير والإحصائيات",
    };
    return titles[activeTab] || "لوحة التحكم";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600 mt-1">إدارة ومتابعة مطعمك</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Eye size={20} />
            عرض المطعم
          </button>
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              5
            </span>
          </button>
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">م</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
