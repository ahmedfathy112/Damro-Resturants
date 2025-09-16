// services/reviewService.js
import { supabase } from "@/lib/supabase";

export const reviewService = {
  // الحصول على تقييمات مطعم
  async getRestaurantReviews(restaurantId) {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        users (
          first_name,
          last_name,
          profile_image
        )
      `
      )
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // إضافة تقييم جديد
  async addReview(review) {
    const { data, error } = await supabase
      .from("reviews")
      .insert(review)
      .select()
      .single();

    return { data, error };
  },

  // الحصول على تقييمات المستخدم
  async getUserReviews(userId) {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        restaurants (
          restaurant_name,
          restaurant_image
        ),
        products (
          name,
          image
        )
      `
      )
      .eq("reviewer_id", userId)
      .order("created_at", { ascending: false });

    return { data, error };
  },
};
