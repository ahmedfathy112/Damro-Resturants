import { cache } from "react";
import { supabase } from "./supabaseClient";

/**
 * Server-side cached function for fetching restaurants
 * Uses React cache() to memoize within a single render pass
 */
export const getCachedRestaurants = cache(async () => {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
});

/**
 * Server-side cached function for fetching restaurant by ID
 */
export const getCachedRestaurant = cache(async (restaurantId) => {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", restaurantId)
    .single();

  if (error) throw error;
  return data;
});

/**
 * Server-side cached function for fetching menu items
 */
export const getCachedMenuItems = cache(async (restaurantId) => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
});
