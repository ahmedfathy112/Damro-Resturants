// components/restaurant/Sidebar.jsx
import {
  Home,
  ShoppingCart,
  UtensilsCrossed,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Package,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, stats }) => {
  const menuItems = [
    { id: "overview", label: "نظرة عامة", icon: Home },
    {
      id: "orders",
      label: "إدارة الطلبات",
      icon: ShoppingCart,
      badge: stats?.newOrders,
    },
    { id: "products", label: "إدارة المنتجات", icon: UtensilsCrossed },
    { id: "categories", label: "الفئات", icon: Package },
    { id: "reviews", label: "التقييمات", icon: Star },
    { id: "analytics", label: "التقارير والإحصائيات", icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed right-0 top-0 overflow-y-auto border-l border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">لوحة التحكم</h2>
        <p className="text-sm text-gray-600">مطعم الذواقة</p>
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            نشط
          </span>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-right p-3 rounded-lg flex items-center gap-3 transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <IconComponent size={20} />
                  {item.label}
                  {item.badge && (
                    <span className="mr-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button className="w-full text-right p-3 rounded-lg flex items-center gap-3 hover:bg-gray-100 text-gray-700 mb-2">
          <Settings size={20} />
          إعدادات المطعم
        </button>
        <button className="w-full text-right p-3 rounded-lg flex items-center gap-3 hover:bg-red-50 text-red-600">
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
