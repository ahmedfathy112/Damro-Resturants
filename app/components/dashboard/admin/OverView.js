import {
  Store,
  Users,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Bell,
} from "lucide-react";
import StatCard from "./StateCard";

const OverviewTab = ({
  stats,
  pendingRestaurants,
  recentOrders,
  notifications,
}) => {
  return (
    <div className="space-y-6">
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Store}
          title="إجمالي المطاعم"
          value={stats.totalRestaurants}
          subtitle={`${stats.activeRestaurants} نشط`}
          color="blue"
        />
        <StatCard
          icon={Users}
          title="العملاء"
          value={stats.totalCustomers.toLocaleString()}
          subtitle={`+${stats.newRegistrations} جديد هذا الشهر`}
          color="green"
        />
        <StatCard
          icon={ShoppingCart}
          title="إجمالي الطلبات"
          value={stats.totalOrders.toLocaleString()}
          color="purple"
        />
        <StatCard
          icon={DollarSign}
          title="الإيرادات"
          value={`${stats.totalRevenue.toLocaleString()} ج.م`}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* طلبات الموافقة المعلقة */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              طلبات الموافقة المعلقة
            </h3>
            <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
              {stats.pendingApproval} معلق
            </span>
          </div>
          <div className="space-y-3">
            {pendingRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{restaurant.name}</p>
                  <p className="text-sm text-gray-600">{restaurant.owner}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                    <CheckCircle size={18} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                    <XCircle size={18} />
                  </button>
                  <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* أحدث الطلبات */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            أحدث الطلبات
          </h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">
                    {order.customer} - {order.restaurant}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    {order.amount} ج.م
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "تم التسليم"
                        ? "bg-green-100 text-green-800"
                        : order.status === "قيد التحضير"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الإشعارات */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          الإشعارات الحديثة
        </h3>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
            >
              <div
                className={`p-2 rounded-full ${
                  notification.type === "approval"
                    ? "bg-blue-100"
                    : notification.type === "complaint"
                    ? "bg-red-100"
                    : "bg-green-100"
                }`}
              >
                <Bell
                  size={16}
                  className={
                    notification.type === "approval"
                      ? "text-blue-600"
                      : notification.type === "complaint"
                      ? "text-red-600"
                      : "text-green-600"
                  }
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{notification.message}</p>
                <p className="text-sm text-gray-600">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
