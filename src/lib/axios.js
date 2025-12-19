import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

let refreshPromise = null;

instance.interceptors.response.use(
  (res) => res,
  // 모든 에러가 발생한 요청에 대해서의 처리
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      // 현재 진행중인 refresh가 없다면
      if (!refreshPromise) {
        // refresh 요청을 진행
        refreshPromise = instance.post("/auth/token/refresh", undefined, {
          _retry: true,
        });
      }

      // refresh가 종료되기까지 대기
      await refreshPromise;
      refreshPromise = null;

      // 기존 요청 수행
      return instance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default instance;
