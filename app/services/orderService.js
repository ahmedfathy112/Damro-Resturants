// services/orderService.js
import { supabase } from "@/lib/supabase";

export const orderService = {
  // الحصول على طلبات المستخدم
  async getUserOrders(userId, status = null) {
    let query = supabase
      .from("orders")
      .select(
        `
        *,
        restaurants (
          restaurant_name,
          restaurant_image
        ),
        order_items (
          *,
          products (
            name,
            image
          )
        )
      `
      )
      .eq("customer_id", userId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // الحصول على الطلبات الحالية (غير المكتملة)
  async getCurrentOrders(userId) {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        restaurants (
          restaurant_name,
          restaurant_image,
          phone
        ),
        order_items (
          *,
          products (
            name,
            image
          )
        )
      `
      )
      .eq("customer_id", userId)
      .not("status", "in", "(delivered,cancelled)")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // إنشاء طلب جديد
  async createOrder(orderData, orderItems) {
    // بدء transaction
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) return { data: null, error: orderError };

    // إضافة عناصر الطلب
    const itemsWithOrderId = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId)
      .select();

    if (itemsError) {
      // في حالة الخطأ، احذف الطلب
      await supabase.from("orders").delete().eq("id", order.id);
      return { data: null, error: itemsError };
    }

    return { data: { order, items }, error: null };
  },

  // تحديث حالة الطلب
  async updateOrderStatus(orderId, status) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single();

    return { data, error };
  },

  // الحصول على إحصائيات الطلبات
  async getOrderStats(userId) {
    const { data, error } = await supabase
      .from("orders")
      .select("status, total_amount")
      .eq("customer_id", userId);

    if (error) return { data: null, error };

    const stats = {
      total: data.length,
      completed: data.filter((o) => o.status === "delivered").length,
      current: data.filter(
        (o) => !["delivered", "cancelled"].includes(o.status)
      ).length,
      cancelled: data.filter((o) => o.status === "cancelled").length,
      totalAmount: data.reduce((sum, o) => sum + o.total_amount, 0),
    };

    return { data: stats, error: null };
  },
};
