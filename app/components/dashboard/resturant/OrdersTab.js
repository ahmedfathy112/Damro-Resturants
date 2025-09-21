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
  User,
  ChevronDown,
  ChevronUp,
  Truck,
  Package,
  CheckSquare,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";

const OrdersTab = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [restaurantId]);

  const fetchOrders = async () => {
    if (!restaurantId) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc("get_restaurant_orders", {
        restaurant_uuid: restaurantId,
      });

      if (error) {
        console.error("Error calling stored function:", error);
        return;
      }

      const formattedOrders = data.map((order) => ({
        id: order.order_id?.substring(0, 8) || "N/A",
        fullId: order.order_id,
        date: new Date(order.created_at).toLocaleDateString("ar-EG"),
        time: new Date(order.created_at).toLocaleTimeString("ar-EG"),
        status: getOrderStatusText(order.status),
        statusKey: order.status,
        total: order.total_amount,
        customer: {
          name: order.user_full_name || "عميل",
          phone: order.user_phone || "غير متوفر",
          address: order.user_address || "غير متوفر",
        },
        items: (order.order_items || []).map((item) => ({
          name: item.menu_item?.name || "منتج",
          quantity: item.quantity,
          price: (item.price_at_time * item.quantity).toFixed(2),
          image: item.menu_item?.image_url,
        })),
        originalData: order,
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusText = (status) => {
    const statusMap = {
      pending: "معلق",
      accepted: "مقبول",
      rejected: "مرفوض",
      delivered: "تم التسليم",
    };
    return statusMap[status] || status;
  };

  const getStatusFromText = (statusText) => {
    const statusMap = {
      معلق: "pending",
      مقبول: "accepted",
      مرفوض: "rejected",
      "تم التسليم": "delivered",
    };
    return statusMap[statusText] || statusText;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.includes(searchTerm) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm);

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

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

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.fullId === orderId
            ? {
                ...order,
                status: newStatus,
                statusKey: statusKey,
              }
            : order
        )
      );

      setTimeout(() => fetchOrders(), 500);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "معلق":
        return "!bg-blue-100 !text-blue-800";
      case "مقبول":
        return "!bg-green-100 !text-green-800";
      case "مرفوض":
        return "!bg-red-100 !text-red-800";
      case "تم التسليم":
        return "!bg-gray-100 !text-gray-800";
      default:
        return "!bg-gray-100 !text-gray-800";
    }
  };

  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusActions = (order) => {
    const actions = [];

    switch (order.statusKey) {
      case "pending":
        actions.push(
          {
            label: "قبول الطلب",
            status: "مقبول",
            icon: CheckCircle,
            color: "bg-green-600 hover:bg-green-700",
          },
          {
            label: "رفض الطلب",
            status: "مرفوض",
            icon: XCircle,
            color: "bg-red-600 hover:bg-red-700",
          }
        );
        break;
      case "accepted":
        actions.push({
          label: "تم التسليم",
          status: "تم التسليم",
          icon: CheckSquare,
          color: "bg-gray-600 hover:bg-gray-700",
        });
        break;
    }

    return actions;
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="البحث برقم الطلب أو اسم العميل أو الهاتف..."
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
            <option value="معلق">طلبات معلقة</option>
            <option value="مقبول">طلبات مقبولة</option>
            <option value="مرفوض">طلبات مرفوضة</option>
            <option value="تم التسليم">طلبات مسلمة</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Filter size={20} />
            تصدير
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {orders.filter((o) => o.statusKey === "pending").length}
          </div>
          <div className="text-sm text-gray-600">طلبات معلقة</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {orders.filter((o) => o.statusKey === "accepted").length}
          </div>
          <div className="text-sm text-gray-600">طلبات مقبولة</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {orders.filter((o) => o.statusKey === "rejected").length}
          </div>
          <div className="text-sm text-gray-600">طلبات مرفوضة</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {orders.filter((o) => o.statusKey === "delivered").length}
          </div>
          <div className="text-sm text-gray-600">تم التسليم</div>
        </div>
      </div>

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
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => toggleOrderExpand(order.fullId)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">#{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      {order.customer.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">{order.total} ج.م</p>
                    <p className="text-sm text-gray-600">
                      {order.date} - {order.time}
                    </p>
                  </div>
                  {expandedOrder === order.fullId ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </div>
              </div>

              {expandedOrder === order.fullId && (
                <div className="p-4 border-t border-gray-200">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      معلومات العميل:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <User size={18} className="text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">الاسم</p>
                          <p className="font-medium">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Phone size={18} className="text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">الهاتف</p>
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            {order.customer.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg md:col-span-2">
                        <MapPin size={18} className="text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">العنوان</p>
                          <p className="font-medium">
                            {order.customer.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      عناصر الطلب:
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {item.quantity}×
                            </span>
                            <span className="text-gray-900">{item.name}</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {item.price} ج.م
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
                    {getStatusActions(order).map((action, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleStatusChange(order.fullId, action.status)
                        }
                        className={`px-4 py-2 cursor-pointer ${action.color} text-white rounded-lg hover:bg-${action.color}-700 transition-colors flex items-center gap-2`}
                      >
                        <action.icon size={18} />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
