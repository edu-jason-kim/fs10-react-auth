import { createContext, useContext, useEffect, useState } from "react";
import axios from "../lib/axios";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function getMe() {
    const response = await axios.get("/users/me");
    const user = response.data;
    setUser(user);
  }

  async function login({ email, password }) {
    await axios.post("/auth/login", { email, password });
    await getMe();
  }

  async function logout() {}

  async function register({ email, password, name }) {
    await axios.post("/users", { name, email, password });
    await login({ email, password });
  }

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("반드시 AuthProvider 안에서 사용해야 합니다.");
  }
  return context;
}
