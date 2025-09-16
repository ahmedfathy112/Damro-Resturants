// components/restaurant/OverviewTab.jsx
import {
  ShoppingCart,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Bell,
} from "lucide-react";
import StatCard from "../admin/StateCard";

const OverviewTab = ({ stats, recentOrders, notifications }) => {
  return (
    <div className="space-y-6">
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingCart}
          title="الطلبات اليوم"
          value={stats.todayOrders}
          subtitle={`${stats.newOrders} طلب جديد`}
          color="blue"
        />
        <StatCard
          icon={DollarSign}
          title="الإيرادات اليوم"
          value={`${stats.todayRevenue} ج.م`}
          subtitle={`${stats.monthlyRevenue} ج.م هذا الشهر`}
          color="green"
        />
        <StatCard
          icon={Star}
          title="التقييم العام"
          value={stats.averageRating}
          subtitle={`${stats.totalReviews} تقييم`}
          color="yellow"
        />
        <StatCard
          icon={Clock}
          title="وقت التحضير المتوسط"
          value={`${stats.avgPreparationTime} دقيقة`}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أحدث الطلبات */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              أحدث الطلبات
            </h3>
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {stats.newOrders} جديد
            </span>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.time}</p>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    {order.amount} ج.م
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "جديد"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "قيد التحضير"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "جاهز"
                        ? "bg-green-100 text-green-800"
                        : order.status === "تم التسليم"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex gap-1 mr-2">
                  {order.status === "جديد" && (
                    <>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors">
                        <CheckCircle size={16} />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors">
                        <XCircle size={16} />
                      </button>
                    </>
                  )}
                  <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* أداء اليوم */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            أداء اليوم
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">طلبات جديدة</span>
              </div>
              <span className="font-semibold text-blue-700">
                {stats.newOrders}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700">قيد التحضير</span>
              </div>
              <span className="font-semibold text-yellow-700">
                {stats.preparingOrders}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">تم التسليم</span>
              </div>
              <span className="font-semibold text-green-700">
                {stats.deliveredOrders}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">ملغاة</span>
              </div>
              <span className="font-semibold text-red-700">
                {stats.cancelledOrders}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* أحدث التقييمات */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          أحدث التقييمات
        </h3>
        <div className="space-y-4">
          {notifications
            .filter((n) => n.type === "review")
            .map((review) => (
              <div
                key={review.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < review.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {review.customer}
                    </p>
                    <p className="text-xs text-gray-500">{review.time}</p>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* الإشعارات */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          الإشعارات الحديثة
        </h3>
        <div className="space-y-3">
          {notifications
            .filter((n) => n.type !== "review")
            .map((notification) => (
              <div
                key={notification.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className={`p-2 rounded-full ${
                    notification.type === "order"
                      ? "bg-blue-100"
                      : notification.type === "payment"
                      ? "bg-green-100"
                      : "bg-yellow-100"
                  }`}
                >
                  <Bell
                    size={16}
                    className={
                      notification.type === "order"
                        ? "text-blue-600"
                        : notification.type === "payment"
                        ? "text-green-600"
                        : "text-yellow-600"
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
