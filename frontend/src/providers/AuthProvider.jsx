import { createContext, useContext, useEffect, useState } from "react";
import { api, customerSession } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const token = customerSession.get();
    const cached = customerSession.getUser();
    if (!token) {
      setLoading(false);
      return;
    }
    if (cached) setUser(cached);
    api("/auth/me", { token })
      .then((me) => {
        if (me.role === "admin") {
          customerSession.clear();
          customerSession.clearUser();
          setUser(null);
          return;
        }
        setUser(me);
        customerSession.setUser(me);
      })
      .catch(() => {
        customerSession.clear();
        customerSession.clearUser();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const applyAuthResult = (result) => {
    if (result.user.role === "admin") {
      throw new Error("Please use the admin panel to sign in as administrator.");
    }
    customerSession.set(result.token);
    customerSession.setUser(result.user);
    setUser(result.user);
    setLoginOpen(false);
    return result.user;
  };

  const login = async (email, password) => {
    const result = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password }),
    });
    return applyAuthResult(result);
  };

  const register = async ({ name, email, password, phone, emailToken }) => {
    const result = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone, emailToken }),
    });
    return applyAuthResult(result);
  };

  const sendSignupOtp = async (email) => {
    return api("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email: email.trim() }),
    });
  };

  const verifySignupOtp = async (email, otp) => {
    return api("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), otp: String(otp).trim() }),
    });
  };

  const loginWithGoogle = async ({ idToken, accessToken }) => {
    const result = await api("/auth/google", {
      method: "POST",
      body: JSON.stringify({
        ...(idToken ? { idToken } : {}),
        ...(accessToken ? { accessToken } : {}),
      }),
    });
    return applyAuthResult(result);
  };

  const logout = () => {
    customerSession.clear();
    customerSession.clearUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        loginOpen,
        setLoginOpen,
        openLogin: () => setLoginOpen(true),
        closeLogin: () => setLoginOpen(false),
        login,
        register,
        sendSignupOtp,
        verifySignupOtp,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
