import axios from "axios";

const instance = axios.create({
  baseURL: "https://learn.codeit.kr/api/link-service",
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => res,
  // 모든 에러가 발생한 요청에 대해서의 처리
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      await instance.post("/auth/token/refresh", undefined, { _retry: true });
      return instance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default instance;
