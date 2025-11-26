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
      // Step 1: Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error && error.status !== 404) {
        // Ignore 404 errors (user already signed out)
        console.warn("Supabase signOut error:", error);
      }
    } catch (err) {
      console.warn("Supabase signOut error:", err);
    }

    // Step 2: Clear all local storage tokens
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      sessionStorage.clear();
    }

    // Step 3: Clear React state by calling refreshUser (will detect no token and clear state)
    window.location.reload();
    setIsAuthenticated(false);
    setIsCustomer(false);
    setUserId(null);
    setUserName(null);
    setUser(null);
    setResturant(false);

    // Step 4: Redirect to login page
    if (typeof window !== "undefined") {
      try {
        window.location.href = "/user/login";
      } catch (e) {
        window.location.reload();
      }
    }
  };

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      let token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      // If no token in localStorage, check Supabase session (from OAuth)
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

      let fullName = fullNameRaw ? fixEncoding(fullNameRaw) : null;

      // Fallback: if fullName is not in JWT, try Supabase auth user metadata
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
        } catch (e) {
          // ignore
        }
      }

      // Last resort: use email prefix
      if (!fullName && decoded.email) {
        fullName = decoded.email.split("@")[0];
      }
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

      // If this session came from Google OAuth, treat the user as a customer
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
        // If the app_users row contains an explicit user_type, prefer it
        if (fetched) {
          if (fetched.user_type) {
            setIsCustomer(fetched.user_type === "customer");
            setResturant(fetched.user_type === "restaurant");
          }
          // Prefer the canonical name from the app_users table when available
          if (fetched.full_name) {
            setUserName(fetched.full_name);
          }
        }
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

    // Subscribe to Supabase auth state changes for seamless OAuth integration
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Sync auth state changes with localStorage
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.access_token) {
            localStorage.setItem("access_token", session.access_token);
            if (session.refresh_token) {
              localStorage.setItem("refresh_token", session.refresh_token);
            }
          }
        } else if (event === "SIGNED_OUT") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
        // Refresh UI state
        await refreshUser();
      }
    );

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
      // Unsubscribe from auth state changes
      authListener?.unsubscribe?.();
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
