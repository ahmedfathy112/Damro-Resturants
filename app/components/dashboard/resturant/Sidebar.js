"use client";
import {
  Home,
  ShoppingCart,
  UtensilsCrossed,
  Star,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../../context/Authcontext";
import { useState } from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { userName, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "نظرة عامة", icon: Home },
    { id: "orders", label: "إدارة الطلبات", icon: ShoppingCart },
    { id: "products", label: "إدارة المنتجات", icon: UtensilsCrossed },
    { id: "Reviews", label: "التقييمات", icon: Star },
  ];

  return (
    <>
      <button
        className="md:hidden fixed top-4 right-0 z-50 bg-white shadow p-2 rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-lg border-l border-gray-200 z-50 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "translate-x-full"} 
        md:translate-x-0 md:static`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">لوحة التحكم</h2>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-6 py-2 border-b border-gray-200">
          <p className="text-sm text-gray-600">{userName}</p>
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
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-right p-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <IconComponent size={20} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* LogOut Btn */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full cursor-pointer text-right p-3 rounded-lg flex items-center gap-3 hover:bg-red-50 text-red-600"
          >
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
