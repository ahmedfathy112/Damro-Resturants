// components/restaurant/OverviewTab.jsx
"use client";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  Bell,
} from "lucide-react";
import StatCard from "../admin/StateCard";
import { supabase } from "../../../lib/supabaseClient";

const OverviewTab = ({ restaurantId }) => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    newOrders: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    preparingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      if (!restaurantId) return;

      try {
        setLoading(true);

        // جلب إحصائيات الطلبات
        const today = new Date().toISOString().split("T")[0];

        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("id, created_at, status, total_amount")
          .eq("restaurant_id", restaurantId)
          .gte("created_at", `${today}T00:00:00`)
          .lte("created_at", `${today}T23:59:59`);

        if (ordersError) throw ordersError;

        // جلب التقييمات - استعلام معدل
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select(
            `
          id,
          rating,
          comment,
          created_at,
          user_id,
          app_users (
            full_name
          )
        `
          )
          .eq("restaurant_id", restaurantId)
          .order("created_at", { ascending: false })
          .limit(5);

        if (reviewsError) throw reviewsError;

        // حساب الإحصائيات
        const todayOrders = ordersData?.length || 0;
        const newOrders =
          ordersData?.filter((order) => order.status === "pending").length || 0;
        const todayRevenue =
          ordersData?.reduce(
            (sum, order) => sum + (order.total_amount || 0),
            0
          ) || 0;

        const preparingOrders =
          ordersData?.filter((order) => order.status === "preparing").length ||
          0;
        const deliveredOrders =
          ordersData?.filter((order) => order.status === "delivered").length ||
          0;
        const cancelledOrders =
          ordersData?.filter((order) => order.status === "cancelled").length ||
          0;

        // حساب متوسط التقييم
        const ratings = reviewsData?.map((review) => review.rating) || [];
        const averageRating =
          ratings.length > 0
            ? (
                ratings.reduce((sum, rating) => sum + rating, 0) /
                ratings.length
              ).toFixed(1)
            : 0;

        // تحديث الحالة
        setStats({
          todayOrders,
          newOrders,
          todayRevenue,
          monthlyRevenue: todayRevenue * 30,
          averageRating: parseFloat(averageRating),
          totalReviews: ratings.length,
          preparingOrders,
          deliveredOrders,
          cancelledOrders,
        });

        // تحضير بيانات الطلبات الأخيرة
        const formattedOrders =
          ordersData?.slice(0, 5).map((order) => ({
            id: order.id.substring(0, 8),
            customer: "عميل",
            time: new Date(order.created_at).toLocaleTimeString("ar-EG"),
            amount: order.total_amount,
            status: getOrderStatusText(order.status),
          })) || [];

        setRecentOrders(formattedOrders);

        // تحضير بيانات التقييمات - معالجة البيانات بشكل صحيح
        const reviewNotifications =
          reviewsData?.map((review) => ({
            id: review.id,
            type: "review",
            rating: review.rating,
            customer: review.app_users?.full_name || "عميل",
            time: new Date(review.created_at).toLocaleDateString("ar-EG"),
            comment: review.comment,
          })) || [];

        setNotifications(reviewNotifications);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [restaurantId]);

  // translate order status to Arabic
  const getOrderStatusText = (status) => {
    const statusMap = {
      pending: "جديد",
      preparing: "قيد التحضير",
      ready: "جاهز",
      delivered: "تم التسليم",
      cancelled: "ملغي",
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 p-6 rounded-xl animate-pulse h-32"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-200 p-6 rounded-xl animate-pulse h-64"></div>
          <div className="bg-gray-200 p-6 rounded-xl animate-pulse h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* main stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          value={`${stats.todayRevenue.toFixed(2)} ج.م`}
          subtitle={`${stats.monthlyRevenue.toFixed(2)} ج.م تقدير الشهر`}
          color="green"
        />
        <StatCard
          icon={Star}
          title="التقييم العام"
          value={stats.averageRating}
          subtitle={`${stats.totalReviews} تقييم`}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* newest order */}
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
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">#{order.id}</p>
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
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                لا توجد طلبات اليوم
              </p>
            )}
          </div>
        </div>

        {/* performance of today */}
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

      {/* newest review */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          أحدث التقييمات
        </h3>
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((review) => (
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
                  <p className="text-gray-700 text-sm">
                    {review.comment || "لا يوجد تعليق"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              لا توجد تقييمات حتى الآن
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
