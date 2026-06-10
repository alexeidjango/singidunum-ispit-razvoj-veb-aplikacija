import axios from "axios";
import { configure } from "axios-hooks";
import { AUTH_REFRESH } from "./endpoints";
import { getAccess, getRefresh, setTokens, clear } from "../auth/tokenStorage";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
});

// ── Request interceptor: attach Bearer token ──────────────────────────────
instance.interceptors.request.use((config) => {
  const token = getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: single-flight 401 refresh ──────────────────────
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  pendingQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refresh = getRefresh();
    if (!refresh) {
      clear();
      window.location.assign("/login");
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(instance(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${instance.defaults.baseURL}${AUTH_REFRESH}`,
        { refresh },
      );
      setTokens(data.access);
      instance.defaults.headers.common.Authorization = `Bearer ${data.access}`;
      originalRequest.headers.Authorization = `Bearer ${data.access}`;
      processQueue(null, data.access);
      return instance(originalRequest);
    } catch (err) {
      processQueue(err, null);
      clear();
      window.location.assign("/login");
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

// Wire axios-hooks to use this instance
configure({ axios: instance });

export default instance;
