import { createContext, useContext, useEffect, useState } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  user: null,
  isPending: true,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(true);

  async function getMe() {
    try {
      setIsPending(true);
      const response = await axios.get("/users/me");
      const user = response.data;
      setUser(user);
    } catch (error) {
      // 만약에 요청이 401이 발생하면, refresh를 시도한다.
      // if (error.response.status === 401) {
      //   await axios.post("/auth/token/refresh");
      //   // 새롭게 받은 토큰을 활용하여 기존 요청을 재시도
      //   const response = await axios.get("/users/me");
      //   const user = response.data;
      //   setUser(user);
      // }
    } finally {
      setIsPending(false);
    }
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
    getMe(); // 비동기
  }, []);

  return (
    <AuthContext.Provider value={{ user, isPending, login, logout, register }}>
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
    if (required && !context.user && !context.isPending) {
      navigate("/login");
    }
  }, [required, context.user, context.isPending, navigate]);

  return context;
}
