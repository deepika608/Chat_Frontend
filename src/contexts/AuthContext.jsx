import { createContext, useContext, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      const res = await api.auth.login({
        email,
        password, // must match backend
      });

      if (res.token) {
        localStorage.setItem("token", res.token);
      }

      setUser({ email });
    } catch (err) {
      throw new Error(err.message || "Login failed");
    }
  };

  // ✅ REGISTER (FINAL FIXED)
  const register = async (email, password) => {
    try {
      console.log("REGISTER SENT:", { email, password }); // debug

      await api.auth.register({
        email,
         password, // must match backend
      });
    } catch (err) {
      throw new Error(err.message || "Register failed");
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };