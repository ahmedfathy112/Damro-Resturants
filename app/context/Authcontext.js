"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  isAuthenticated: false,
  isCustomer: false,
  isProfileComplete: false, // الجزء الجديد 1
  userId: null,
  userName: null,
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
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
  const [isProfileComplete, setIsProfileComplete] = useState(false); // الجزء الجديد 2
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Isresturant, setResturant] = useState(false);
  const [resturantAddress, setResturantAddress] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  const router = useRouter();

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

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error && error.status !== 404) {
        console.warn("Supabase signOut error:", error);
      }
    } catch (err) {
      console.warn("Supabase signOut error:", err);
    }

    window.location.reload();

    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("supabase.auth.token");
      sessionStorage.clear();
    }

    setIsAuthenticated(false);
    setIsCustomer(false);
    setIsProfileComplete(false); // الجزء الجديد 3
    setUserId(null);
    setUserName(null);
    setUser(null);
    setResturant(false);

    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.href = "/user/login";
      }, 100);
    }
  };

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      let token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      if (!token && typeof window !== "undefined") {
        const { data } = await supabase.auth.getSession();
        if (data.session?.access_token) {
          token = data.session.access_token;
          localStorage.setItem("access_token", token);
        }
      }

      if (!token) {
        setIsAuthenticated(false);
        setIsCustomer(false);
        setIsProfileComplete(false); // الجزء الجديد 4
        setUserId(null);
        setUserName(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const decoded = decodeJwt(token);
      if (!decoded) {
        setIsAuthenticated(false);
        setIsCustomer(false);
        setIsProfileComplete(false); // الجزء الجديد 5
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

      function fixEncoding(str) {
        if (!str) return null;
        return Buffer.from(str, "latin1").toString("utf8");
      }

      const fullNameRaw =
        decoded.user_metadata?.full_name || decoded.full_name || null;

      let fullName = fullNameRaw ? fixEncoding(fullNameRaw) : null;

      if (!fullName && typeof window !== "undefined") {
        try {
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser?.user) {
            const metaName =
              authUser.user.user_metadata?.full_name ||
              authUser.user.user_metadata?.name ||
              authUser.user.email?.split("@")[0];
            fullName = metaName ? fixEncoding(metaName) : null;
          }
        } catch (e) {}
      }

      if (!fullName && decoded.email) {
        fullName = decoded.email.split("@")[0];
      }

      const addressRaw =
        decoded.user_metadata?.restaurant_address || decoded.address || null;
      const addressFixed = addressRaw ? fixEncoding(addressRaw) : null;
      setResturantAddress(addressFixed);

      const userAddressRaw =
        decoded.user_metadata?.address || decoded.address || null;
      const userAddressFixed = userAddressRaw
        ? fixEncoding(userAddressRaw)
        : null;
      setUserAddress(userAddressFixed);

      setIsAuthenticated(Boolean(token));
      setUserId(sub);

      const provider =
        decoded.app_metadata?.provider ||
        decoded.user_metadata?.provider ||
        null;

      if (provider === "google") {
        setIsCustomer(true);
        setResturant(false);
      } else {
        setIsCustomer(userType === "customer");
        setResturant(userType === "restaurant");
      }

      setUserName(fullName || null);

      if (sub) {
        const fetched = await fetchUserFromSupabase(sub);
        setUser(fetched);

        // --- الجزء الجديد: التحقق من اكتمال الملف الشخصي ---
        if (fetched) {
          // نتحقق من وجود الهاتف والعنوان في قاعدة البيانات
          const hasPhone = !!fetched.phone;
          const hasAddress = !!(fetched.address || userAddressFixed);
          setIsProfileComplete(hasPhone && hasAddress);

          if (fetched.user_type) {
            setIsCustomer(fetched.user_type === "customer");
            setResturant(fetched.user_type === "restaurant");
          }
          if (fetched.full_name) {
            setUserName(fetched.full_name);
          }
        } else {
          setIsProfileComplete(false);
        }
        // ----------------------------------------------
      } else {
        setUser(null);
        setIsProfileComplete(false);
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

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.access_token) {
            localStorage.setItem("access_token", session.access_token);
            if (session.refresh_token) {
              localStorage.setItem("access_token", session.refresh_token);
            }
          }
        } else if (event === "SIGNED_OUT") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
        await refreshUser();
      }
    );

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
      authListener?.unsubscribe?.();
    };
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isCustomer,
        isProfileComplete, // إضافة القيمة هنا
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
