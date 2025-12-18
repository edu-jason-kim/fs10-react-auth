import { createContext, useContext, useEffect, useState } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

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

// useAuth(true): 사용자 정보가 있어야만 하는 페이지
export function useAuth(required) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("반드시 AuthProvider 안에서 사용해야 합니다.");
  }

  useEffect(() => {
    if (required && !context.user) {
      navigate("/login");
    }
  }, [required, context.user, navigate]);

  return context;
}
