// services/restaurantService.js
import { supabase } from "@/lib/supabase";

export const restaurantService = {
  // الحصول على جميع المطاعم المعتمدة
  async getApprovedRestaurants() {
    const { data, error } = await supabase
      .from("restaurants")
      .select(
        `
        *,
        users (
          first_name,
          last_name,
          phone
        )
      `
      )
      .eq("is_approved", true)
      .order("average_rating", { ascending: false });

    return { data, error };
  },

  // الحصول على مطعم بالـ ID
  async getRestaurantById(id) {
    const { data, error } = await supabase
      .from("restaurants")
      .select(
        `
        *,
        users (
          first_name,
          last_name,
          phone,
          email
        ),
        products (
          *
        )
      `
      )
      .eq("id", id)
      .single();

    return { data, error };
  },

  // الحصول على منتجات مطعم
  async getRestaurantProducts(restaurantId) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true)
      .order("name");

    return { data, error };
  },

  // البحث في المطاعم
  async searchRestaurants(query, cuisine = null) {
    let supabaseQuery = supabase
      .from("restaurants")
      .select("*")
      .eq("is_approved", true)
      .ilike("restaurant_name", `%${query}%`);

    if (cuisine) {
      supabaseQuery = supabaseQuery.eq("cuisine_type", cuisine);
    }

    const { data, error } = await supabaseQuery;
    return { data, error };
  },
};
