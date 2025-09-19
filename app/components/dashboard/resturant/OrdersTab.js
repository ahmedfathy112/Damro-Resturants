// components/restaurant/OrdersTab.jsx
"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MapPin,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";

const OrdersTab = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!restaurantId) return;

      try {
        setLoading(true);

        // جلب الطلبات مع بيانات العملاء والعناصر
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(
            `
            *,
            app_users:user_id (full_name, phone, address),
            order_items:order_items (*, menu_items (name, price))
          `
          )
          .eq("restaurant_id", restaurantId)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        // تحويل البيانات إلى التنسيق المطلوب
        const formattedOrders = ordersData.map((order) => ({
          id: order.id.substring(0, 8),
          date: new Date(order.created_at).toLocaleDateString("ar-EG"),
          time: new Date(order.created_at).toLocaleTimeString("ar-EG"),
          status: getOrderStatusText(order.status),
          total: order.total_amount,
          customer: {
            name: order.app_users?.full_name || "عميل",
            phone: order.app_users?.phone || "غير متوفر",
            address: order.app_users?.address || "غير متوفر",
          },
          items:
            order.order_items?.map((item) => ({
              name: item.menu_items?.name || "منتج",
              quantity: item.quantity,
              price: (item.price_at_time * item.quantity).toFixed(2),
              notes: item.notes,
            })) || [],
          estimatedTime: order.estimated_time || 30,
          originalData: order, // حفظ البيانات الأصلية للاستخدام لاحقاً
        }));

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [restaurantId]);

  // دالة لتحويل حالة الطلب إلى نص عربي
  const getOrderStatusText = (status) => {
    const statusMap = {
      pending: "جديد",
      confirmed: "مؤكد",
      preparing: "قيد التحضير",
      ready: "جاهز للتسليم",
      on_the_way: "في الطريق",
      delivered: "تم التسليم",
      cancelled: "ملغى",
      rejected: "مرفوض",
    };
    return statusMap[status] || status;
  };

  // دالة للعكس - تحويل النص العربي إلى حالة
  const getStatusFromText = (statusText) => {
    const statusMap = {
      جديد: "pending",
      مؤكد: "confirmed",
      "قيد التحضير": "preparing",
      "جاهز للتسليم": "ready",
      "في الطريق": "on_the_way",
      "تم التسليم": "delivered",
      ملغى: "cancelled",
      مرفوض: "rejected",
    };
    return statusMap[statusText] || statusText;
  };

  // تصفية الطلبات حسب البحث والحالة
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.includes(searchTerm) ||
      order.customer.name.includes(searchTerm) ||
      order.customer.phone.includes(searchTerm);

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // دالة لتغيير حالة الطلب
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const statusKey = getStatusFromText(newStatus);

      const { error } = await supabase
        .from("orders")
        .update({
          status: statusKey,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      // تحديث الحالة المحلية
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      console.log(`تم تغيير حالة الطلب ${orderId} إلى ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "جديد":
        return "bg-blue-100 text-blue-800";
      case "مؤكد":
        return "bg-green-100 text-green-800";
      case "قيد التحضير":
        return "bg-yellow-100 text-yellow-800";
      case "جاهز للتسليم":
        return "bg-purple-100 text-purple-800";
      case "في الطريق":
        return "bg-indigo-100 text-indigo-800";
      case "تم التسليم":
        return "bg-gray-100 text-gray-800";
      case "ملغى":
        return "bg-red-100 text-red-800";
      case "مرفوض":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* شريط البحث والفلاتر */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="البحث برقم الطلب أو اسم العميل..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">جميع الطلبات</option>
            <option value="جديد">طلبات جديدة</option>
            <option value="مؤكد">مؤكدة</option>
            <option value="قيد التحضير">قيد التحضير</option>
            <option value="جاهز للتسليم">جاهزة للتسليم</option>
            <option value="تم التسليم">مسلمة</option>
            <option value="ملغى">ملغاة</option>
            <option value="مرفوض">مرفوضة</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Filter size={20} />
            تصدير
          </button>
        </div>
      </div>

      {/* قائمة الطلبات */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "لا توجد طلبات تطابق معايير البحث"
                : "لا توجد طلبات حتى الآن"}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                {/* رأس الطلب */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.date} - {order.time}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xl text-gray-900">
                      {order.total} ج.م
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} منتج
                    </p>
                  </div>
                </div>

                {/* معلومات العميل */}
                <div className="flex items-start gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {order.customer.name}
                      </h4>
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Phone size={16} />
                      </a>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{order.customer.address}</span>
                    </div>
                  </div>
                </div>

                {/* عناصر الطلب */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">
                    عناصر الطلب:
                  </h5>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                            {item.quantity}×
                          </span>
                          <span className="text-gray-900">{item.name}</span>
                          {item.notes && (
                            <span className="text-gray-500 italic">
                              ({item.notes})
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">
                          {item.price} ج.م
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* الإجراءات */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  {order.status === "جديد" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(order.originalData.id, "مؤكد")
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle size={18} />
                        قبول الطلب
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(order.originalData.id, "مرفوض")
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <XCircle size={18} />
                        رفض الطلب
                      </button>
                    </>
                  )}

                  {order.status === "مؤكد" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order.originalData.id, "قيد التحضير")
                      }
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                    >
                      <Clock size={18} />
                      بدء التحضير
                    </button>
                  )}

                  {order.status === "قيد التحضير" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          order.originalData.id,
                          "جاهز للتسليم"
                        )
                      }
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      الطلب جاهز
                    </button>
                  )}

                  {order.status === "جاهز للتسليم" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order.originalData.id, "في الطريق")
                      }
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <Clock size={18} />
                      في الطريق
                    </button>
                  )}

                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <Eye size={18} />
                    عرض التفاصيل
                  </button>

                  {/* وقت التحضير المقدر */}
                  <div className="mr-auto text-sm text-gray-600">
                    وقت التحضير: {order.estimatedTime} دقيقة
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
