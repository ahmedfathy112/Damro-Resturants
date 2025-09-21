"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext({
  isAuthenticated: false,
  isCustomer: false,
  userId: null,
  userName: null,
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: () => {},
});

function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // add padding
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const json = atob(padded);
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Isresturant, setResturant] = useState(false);
  const [resturantAddress, setResturantAddress] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  const fetchUserFromSupabase = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from("app_users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("Supabase fetch user error:", error);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Error fetching user from Supabase:", err);
      return null;
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (!token) {
        setIsAuthenticated(false);
        setIsCustomer(false);
        setUserId(null);
        setUserName(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const decoded = decodeJwt(token);
      if (!decoded) {
        // token invalid or can't decode
        setIsAuthenticated(false);
        setIsCustomer(false);
        setUserId(null);
        setUserName(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const sub =
        decoded.sub ||
        (decoded.user_metadata && decoded.user_metadata.sub) ||
        null;
      const userType =
        (decoded.user_metadata && decoded.user_metadata.user_type) ||
        decoded.user_type ||
        null;
      // عشان نفك ترميز الاسم اللي مكتوب بالعربيه
      function fixEncoding(str) {
        if (!str) return null;
        return Buffer.from(str, "latin1").toString("utf8");
      }
      const fullNameRaw =
        decoded.user_metadata?.full_name || decoded.full_name || null;

      const fullName = fullNameRaw ? fixEncoding(fullNameRaw) : null;
      // get the address of the resturant if exists
      const addressRaw =
        decoded.user_metadata?.restaurant_address || decoded.address || null;
      const addressFixed = addressRaw ? fixEncoding(addressRaw) : null;
      setResturantAddress(addressFixed);
      // get the address of the resturant if exists
      const userAddress =
        decoded.user_metadata?.address || decoded.address || null;
      const userAddressFixed = userAddress ? fixEncoding(userAddress) : null;
      setUserAddress(userAddressFixed);

      setIsAuthenticated(Boolean(token));
      setUserId(sub);
      setIsCustomer(userType === "customer");
      setResturant(userType === "restaurant");
      setUserName(fullName || null);

      if (sub) {
        const fetched = await fetchUserFromSupabase(sub);
        setUser(fetched);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchUserFromSupabase]);

  useEffect(() => {
    refreshUser();

    function handleStorage() {
      refreshUser();
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
    };
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isCustomer,
        userId,
        userName,
        user,
        loading,
        Isresturant,
        resturantAddress,
        userAddress,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
