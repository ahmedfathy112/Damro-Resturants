import useSWR from "swr";
import { supabase } from "../lib/supabaseClient";
import { swrConfig } from "../lib/swrConfig";

// Fetcher function for restaurants
const fetchRestaurants = async () => {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Fetcher function for dish counts
const fetchDishCounts = async (restaurantIds) => {
  if (!restaurantIds || restaurantIds.length === 0) return {};

  const countsMap = {};
  // Use Promise.all for parallel requests
  const promises = restaurantIds.map(async (restaurantId) => {
    const { count, error } = await supabase
      .from("menu_items")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId);

    if (error) {
      console.error(`Error fetching dishes for restaurant ${restaurantId}:`, error);
      return { id: restaurantId, count: 0 };
    }
    return { id: restaurantId, count: count || 0 };
  });

  const results = await Promise.all(promises);
  results.forEach(({ id, count }) => {
    countsMap[id] = count;
  });

  return countsMap;
};

// Fetcher function for ratings
const fetchRestaurantRatings = async (restaurantIds) => {
  if (!restaurantIds || restaurantIds.length === 0) return {};

  const { data, error } = await supabase
    .from("reviews")
    .select("restaurant_id, rating")
    .in("restaurant_id", restaurantIds);

  if (error) throw error;

  const ratingsMap = {};
  restaurantIds.forEach((id) => {
    ratingsMap[id] = [];
  });

  data.forEach((review) => {
    if (ratingsMap[review.restaurant_id]) {
      ratingsMap[review.restaurant_id].push(review.rating);
    }
  });

  return ratingsMap;
};

/**
 * Custom hook for fetching restaurants with stats (cached with SWR)
 */
export const useRestaurants = () => {
  const { data: restaurants, error, isLoading, mutate } = useSWR(
    "restaurants",
    fetchRestaurants,
    {
      ...swrConfig,
      revalidateIfStale: true,
      revalidateOnMount: true,
    }
  );

  const { data: dishCounts } = useSWR(
    restaurants ? ["dishCounts", restaurants.map((r) => r.id)] : null,
    ([, restaurantIds]) => fetchDishCounts(restaurantIds),
    swrConfig
  );

  const { data: ratings } = useSWR(
    restaurants ? ["ratings", restaurants.map((r) => r.id)] : null,
    ([, restaurantIds]) => fetchRestaurantRatings(restaurantIds),
    swrConfig
  );

  // Combine data
  const restaurantsWithStats = restaurants?.map((restaurant) => {
    const restaurantRatings = ratings?.[restaurant.id] || [];
    const averageRating =
      restaurantRatings.length > 0
        ? (
            restaurantRatings.reduce((sum, rating) => sum + rating, 0) /
            restaurantRatings.length
          ).toFixed(1)
        : 0;

    return {
      ...restaurant,
      average_rating: parseFloat(averageRating),
      total_reviews: restaurantRatings.length,
      dish_count: dishCounts?.[restaurant.id] || 0,
    };
  });

  return {
    restaurants: restaurantsWithStats || [],
    isLoading,
    error,
    mutate,
  };
};
