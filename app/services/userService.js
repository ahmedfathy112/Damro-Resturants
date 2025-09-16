// services/userService.js
import { supabase } from "@/lib/supabase";

export const userService = {
  // الحصول على بيانات المستخدم الحالي
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;

    const { data, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    return dbError ? null : data;
  },

  // الحصول على مستخدم بالـ ID
  async getUserById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  },

  // تحديث بيانات المستخدم
  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  // إنشاء مستخدم جديد
  async createUser(user) {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    return { data, error };
  },
};
