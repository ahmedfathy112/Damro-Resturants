// components/admin/Sidebar.jsx
import {
  Home,
  Store,
  Users,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, stats }) => {
  const menuItems = [
    { id: "overview", label: "نظرة عامة", icon: Home },
    {
      id: "restaurants",
      label: "إدارة المطاعم",
      icon: Store,
      badge: stats?.pendingApproval,
    },
    { id: "customers", label: "العملاء", icon: Users },
    { id: "orders", label: "الطلبات", icon: ShoppingCart },
    { id: "reviews", label: "التقييمات والشكاوى", icon: MessageSquare },
    { id: "analytics", label: "التقارير والإحصائيات", icon: TrendingUp },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed right-0 top-0 overflow-y-auto border-l border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">لوحة التحكم</h2>
        <p className="text-sm text-gray-600">مرحباً، مدير النظام</p>
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
          الإعدادات
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
