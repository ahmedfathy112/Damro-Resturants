"use client";
import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Phone,
  User,
  CreditCard,
  Settings,
  Bell,
  Search,
  Filter,
  Eye,
  Package,
  Trash2,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/Authcontext";
import Swal from "sweetalert2";

// for current stats
const StatsCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// to show the current order
const CurrentOrders = () => {
  const { userId } = useAuth();
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  useEffect(() => {
    const fetchCurrentOrders = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("orders")
          .select(
            `
          id, 
          user_id, 
          restaurant_id, 
          status, 
          total_amount, 
          created_at,
          order_items (
            id,
            quantity,
            menu_items (
              name,
              price
            )
          )
        `
          )
          .eq("user_id", userId)
          .in("status", ["pending", "confirmed", "preparing", "ready"])
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          throw error;
        }

        if (data) {
          const formattedOrders = await Promise.all(
            data.map(async (order) => {
              let restaurantName = "مطعم غير معروف";
              try {
                const { data: restaurantData } = await supabase
                  .from("restaurants")
                  .select("name")
                  .eq("id", order.restaurant_id)
                  .single();

                if (restaurantData) {
                  restaurantName = restaurantData.name;
                }
              } catch (err) {
                console.error("Error fetching restaurant:", err);
              }

              let estimatedTime = "30 دقيقة";
              if (order.status === "preparing") {
                estimatedTime = "25 دقيقة";
              } else if (order.status === "confirmed") {
                estimatedTime = "35 دقيقة";
              }

              const orderItems = order.order_items.map((item) => {
                return `${item.menu_items.name} (${item.quantity}) - ${
                  item.menu_items.price * item.quantity
                } جنية`;
              });

              return {
                id: order.id,
                restaurant: restaurantName,
                items: orderItems,
                total: order.total_amount,
                status: order.status,
                estimatedTime: estimatedTime,
                orderTime: new Date(order.created_at).toLocaleTimeString(
                  "ar-EG",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                ),
              };
            })
          );

          setCurrentOrders(formattedOrders);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching current orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentOrders();
  }, [userId]);

  const deleteOrder = async (orderId) => {
    console.log(orderId);
    if (!userId || !orderId) return;

    try {
      setDeletingOrderId(orderId);
      const { error: itemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId);

      if (itemsError) {
        throw itemsError;
      }

      const { error: orderError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId)
        .eq("user_id", userId);

      if (orderError) {
        throw orderError;
      }

      setCurrentOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );

      await Swal.fire("تم الحذف!", "تم حذف الطلب بنجاح", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      await Swal.fire("خطأ!", "حدث خطأ أثناء حذف الطلب", "error");
    } finally {
      setDeletingOrderId(null);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        text: "في الانتظار",
        color: "text-yellow-600 bg-yellow-100",
        icon: Clock,
      },
      confirmed: {
        text: "تم التأكيد",
        color: "text-blue-600 bg-blue-100",
        icon: CheckCircle,
      },
      preparing: {
        text: "قيد التحضير",
        color: "text-orange-600 bg-orange-100",
        icon: Package,
      },
      ready: {
        text: "جاهز للتسليم",
        color: "text-green-600 bg-green-100",
        icon: CheckCircle,
      },
      delivered: {
        text: "تم التسليم",
        color: "text-green-600 bg-green-100",
        icon: CheckCircle,
      },
      cancelled: {
        text: "ملغي",
        color: "text-red-600 bg-red-100",
        icon: XCircle,
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <p>جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">حدث خطأ: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">الطلبات الحالية</h2>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {currentOrders.length} طلب نشط
        </span>
      </div>

      <div className="space-y-4">
        {currentOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد طلبات حالية</p>
          </div>
        ) : (
          currentOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors relative"
              >
                {/* delete order btn */}
                {order.status === "pending" && (
                  <button
                    onClick={() => deleteOrder(order.id)}
                    disabled={deletingOrderId === order.id}
                    className="absolute bottom-3 left-3 p-2 !text-2xl text-red-500 hover:text-red-700 disabled:opacity-50"
                    title="حذف الطلب"
                  >
                    {deletingOrderId === order.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="!text-2xl w-4 h-4" />
                    )}
                  </button>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">
                        {order.restaurant}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.text}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <p className="mb-1">رقم الطلب: {order.id}</p>
                      <p className="mb-1">وقت الطلب: {order.orderTime}</p>
                      <p>الوقت المتوقع: {order.estimatedTime}</p>
                    </div>

                    <div className="text-sm text-gray-500">
                      {order.items.join(" • ")}
                    </div>
                  </div>

                  <div className="text-left">
                    <p className="text-lg font-semibold text-gray-900">
                      {order.total.toFixed(2)} ج.م
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// for all orders of the user
const OrderHistory = () => {
  const { userId } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        let query = supabase
          .from("orders")
          .select(
            `
            id, 
            user_id, 
            restaurant_id, 
            status, 
            total_amount, 
            created_at,
            order_items (
              id,
              quantity,
              menu_items (
                name,
                price
              )
            )
          `
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (activeTab !== "all") {
          query = query.eq("status", activeTab);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          const formattedOrders = await Promise.all(
            data.map(async (order) => {
              let restaurantName = "مطعم غير معروف";
              try {
                const { data: restaurantData } = await supabase
                  .from("restaurants")
                  .select("name")
                  .eq("id", order.restaurant_id)
                  .single();

                if (restaurantData) {
                  restaurantName = restaurantData.name;
                }
              } catch (err) {
                console.error("Error fetching restaurant:", err);
              }

              let orderItems = [];
              if (order.order_items && order.order_items.length > 0) {
                orderItems = order.order_items.map((item) => {
                  return `${item.quantity}x ${
                    item.menu_items?.name || "عنصر غير معروف"
                  }`;
                });
              } else {
                orderItems = ["عناصر الطلب غير متاحة"];
              }

              return {
                id: order.id,
                restaurant: restaurantName,
                items: orderItems,
                total: order.total_amount,
                status: order.status,
                date: new Date(order.created_at).toLocaleDateString("ar-EG"),
                rating: order.rating || null,
              };
            })
          );

          setOrders(formattedOrders);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [userId, activeTab]);

  const handleDeleteOrder = async (orderId) => {
    if (!userId || !orderId) return;

    // confirm the delete
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لا يمكن التراجع عن هذه العملية!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "إلغاء",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingOrderId(orderId);

      // حذف العناصر أولاً ثم الطلب
      const { error: itemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;

      const { error: orderError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId)
        .eq("user_id", userId);

      if (orderError) throw orderError;

      // تحديث الواجهة بإزالة الطلب المحذوف
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );

      await Swal.fire("تم الحذف!", "تم حذف الطلب بنجاح", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      await Swal.fire("خطأ!", "حدث خطأ أثناء حذف الطلب", "error");
    } finally {
      setDeletingOrderId(null);
    }
  };

  const tabs = [
    { id: "all", label: "جميع الطلبات", count: orders.length },
    {
      id: "delivered",
      label: "مكتملة",
      count: orders.filter((o) => o.status === "delivered").length,
    },
    {
      id: "cancelled",
      label: "ملغية",
      count: orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <p>جاري تحميل سجل الطلبات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">حدث خطأ: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm max-md:w-full max-md:p-1">
      <div className="flex items-center justify-between mb-6 max-md:flex-col">
        <h2 className="text-lg font-semibold text-gray-900">سجل الطلبات</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="البحث في الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">لا توجد طلبات في سجل الطلبات</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors max-md:w-full max-md:p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">
                      {order.restaurant}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status === "delivered"
                        ? "مكتمل"
                        : order.status === "cancelled"
                        ? "ملغي"
                        : order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">
                      رقم الطلب: {order.id}
                    </p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    {order.items.join(" • ")}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">
                      {order.total.toFixed(2)} ج.م
                    </p>
                    <div className="flex items-center gap-2">
                      {order.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < order.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deletingOrderId === order.id}
                        className="text-red-600 hover:text-red-800 cursor-pointer p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        title="حذف الطلب"
                      >
                        {deletingOrderId === order.id ? (
                          <div className="w-4 h-4 border-t-2 border-red-600 border-solid rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4 !text-4xl" />
                        )}
                      </button>
                    </div>
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
// for personal user info
const ProfileInfo = () => {
  const { userId } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ phone: "", address: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("app_users")
          .select("full_name, phone, address, created_at, email")
          .eq("id", userId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setUserProfile({
            name: data.full_name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            joinDate: new Date(data.created_at).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
            }),
            totalOrders: 47,
            favoriteRestaurants: ["مطعم الشام", "كنتاكي", "بيتزا إيطاليا"],
          });
          setFormData({
            phone: data.phone || "",
            address: data.address || "",
          });
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleSaveProfile = async () => {
    if (!formData.phone.trim() || !formData.address.trim()) {
      Swal.fire({
        icon: "warning",
        title: "حقول مطلوبة",
        text: "يرجى ملء رقم الهاتف والعنوان",
      });
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("app_users")
        .update({
          phone: formData.phone,
          address: formData.address,
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      setUserProfile({
        ...userProfile,
        phone: formData.phone,
        address: formData.address,
      });

      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "تم الحفظ",
        text: "تم تحديث بيانات ملفك الشخصي بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Error saving profile:", err);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء حفظ البيانات",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">حدث خطأ: {error}</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <p>لا توجد بيانات للعرض</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">الملف الشخصي</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          <Settings className="w-4 h-4" />
          {isEditing ? "إلغاء" : "تعديل"}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {userProfile.name}
            </h3>
            <p className="text-gray-600">عضو منذ {userProfile.joinDate}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="أدخل رقم هاتفك"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="أدخل عنوانك"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
              >
                {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">رقم الهاتف</p>
                  <p className="font-medium text-gray-900">
                    {userProfile.phone || "لم يتم إضافة رقم هاتف"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">العنوان</p>
                <p className="font-medium text-gray-900">
                  {userProfile.address || "لم يتم إضافة عنوان"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// user dashboard
const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const router = useRouter();
  const { isCustomer, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // to check if he is user or not
  useEffect(() => {
    if (!isCustomer) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isCustomer, router]);

  const menuItems = [
    { id: "overview", label: "نظرة عامة", icon: ShoppingBag },
    { id: "history", label: "سجل الطلبات", icon: Package },
    { id: "profile", label: "الملف الشخصي", icon: User },
  ];
  const { userId } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        // get all user orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("id, total_amount, status")
          .eq("user_id", userId);

        if (ordersError) {
          throw ordersError;
        }

        if (ordersData) {
          // calculate the stats
          const totalOrders = ordersData.length;
          const totalSpent = ordersData.reduce(
            (sum, order) => sum + order.total_amount,
            0
          );
          const pendingOrders = ordersData.filter((order) =>
            ["pending", "confirmed", "preparing", "ready"].includes(
              order.status
            )
          ).length;
          const completedOrders = ordersData.filter(
            (order) => order.status === "delivered"
          ).length;

          setStats({
            totalOrders,
            totalSpent,
            pendingOrders,
            completedOrders,
          });
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-600">حدث خطأ في تحميل الإحصائيات: {error}</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="طلباتي"
                value={stats.pendingOrders}
                icon={Clock}
                color="orange"
              />
              <StatsCard
                title="طلبات مكتملة"
                value={stats.completedOrders}
                icon={Package}
                color="purple"
              />
              <StatsCard
                title="إجمالي المبلغ"
                value={`${stats.totalSpent.toFixed(2)} ج.م`}
                icon={CreditCard}
                color="blue"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CurrentOrders />
              <ProfileInfo />
            </div>
          </div>
        );
      case "history":
        return <OrderHistory />;
      case "profile":
        return <ProfileInfo />;
      default:
        return null;
    }
  };

  if (!isAuthenticated || !isCustomer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="flex">
        {/* Sidebar in Desktop */}
        <div className="w-64 bg-white shadow-sm border-l border-gray-200 min-h-screen hidden md:block">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
          </div>

          <nav className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-right hover:bg-gray-50 transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="!md:hidden !fixed !top-4 !left-4 !z-[9999] !bg-blue-600 !shadow-lg !p-2 !rounded-lg !text-white !hover:bg-blue-700 !transition-colors"
          onClick={() => setIsMobile(!isMobile)}
        >
          <Menu size={24} />
        </button>

        {/* Sidebar in Mobile */}
        {isMobile && (
          <div
            className="!fixed !inset-0 !bg-black !bg-opacity-40 !z-[9998]"
            onClick={() => setIsMobile(false)}
          >
            <div
              className="!absolute !right-0 !top-0 !w-64 !bg-white !shadow-sm !border-l !border-gray-200 !min-h-screen !z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
                <button
                  onClick={() => setIsMobile(false)}
                  className="text-gray-600"
                >
                  ✕
                </button>
              </div>

              <nav className="mt-6">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setIsMobile(false);
                      }}
                      className={`w-full flex items-center gap-3 px-6 py-3 text-right hover:bg-gray-50 transition-colors ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-8 max-md:p-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserDashboard;
