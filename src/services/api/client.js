import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, NativeModules } from "react-native";

const TOKEN_KEY = "@cybersave_token";
let confirmedHost = null;

// Extract the host IP where Metro bundler is serving from
const extractMetroHost = () => {
  try {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/https?:\/\/([^:\/]+)/);
      if (match && match[1] && match[1] !== "localhost" && match[1] !== "127.0.0.1") {
        return match[1];
      }
    }
  } catch (e) {}
  return null;
};

// Return candidate base URLs in order of highest likelihood
const getCandidateBases = () => {
  const list = [];
  const metroHost = extractMetroHost();

  // 1. Dynamically extracted Metro host IP (auto-detects laptop IP on physical devices and emulator)
  if (metroHost) {
    list.push(`http://${metroHost}:5000/api`);
  }

  // 2. Android emulator virtual router bridge (independent of laptop IP, always routes to host PC)
  if (Platform.OS === "android") {
    list.push("http://10.0.2.2:5000/api");
  }

  // 3. Localhost (works for iOS simulator, web, or when adb reverse tcp:5000 is active)
  list.push("http://localhost:5000/api");
  list.push("http://127.0.0.1:5000/api");

  return Array.from(new Set(list));
};

const getInitialBaseUrl = () => {
  const candidates = getCandidateBases();
  // On Android, if metroHost isn't resolved yet at import time, prefer 10.0.2.2 over localhost
  if (Platform.OS === "android" && !extractMetroHost()) {
    return "http://10.0.2.2:5000/api";
  }
  return candidates[0] || "http://10.0.2.2:5000/api";
};

let BASE_URL = getInitialBaseUrl();
console.log("[API Client] Initial Base URL active:", BASE_URL);

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fast background probe on startup to verify and lock in the working host immediately
(async () => {
  const candidates = getCandidateBases();
  for (const base of candidates) {
    try {
      const pingUrl = base.replace(/\/api\/?$/, "") + "/health";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(pingUrl, { method: "GET", signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        confirmedHost = base;
        apiClient.defaults.baseURL = base;
        console.log("[API Client] Probed and confirmed active baseURL:", base);
        break;
      }
    } catch (e) {
      // Continue to next candidate
    }
  }
})();

apiClient.interceptors.request.use(
  async (config) => {
    try {
      // If we don't have a confirmed host yet, re-check if Metro host became available
      if (!confirmedHost) {
        const metroHost = extractMetroHost();
        if (metroHost) {
          const metroBase = `http://${metroHost}:5000/api`;
          config.baseURL = metroBase;
          apiClient.defaults.baseURL = metroBase;
        }
      } else {
        config.baseURL = confirmedHost;
      }

      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("[API Client] Request setup warning:", err.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.config?.baseURL) {
      confirmedHost = response.config.baseURL;
    }
    return response;
  },
  async (error) => {
    // If the server answered with ANY HTTP status code (401, 403, 404, 500, etc.),
    // it means the host connection is completely healthy. Do NOT treat it as a network error!
    if (error.response) {
      if (error.config?.baseURL) {
        confirmedHost = error.config.baseURL;
      }
      return Promise.reject(error);
    }

    const config = error.config;
    if (!config || config._retry) {
      return Promise.reject(error);
    }
    config._retry = true;

    // True network failure / timeout: iterate through candidates with generous timeout
    const candidates = getCandidateBases();
    const originalUrl = config.url || "";
    const cleanPath = originalUrl.startsWith("/") ? originalUrl : `/${originalUrl}`;

    for (const base of candidates) {
      if (base === config.baseURL) continue;
      try {
        const retryClient = axios.create({
          baseURL: base,
          timeout: 10000,
          headers: config.headers,
        });
        const res = await retryClient.request({
          method: config.method || "get",
          url: cleanPath,
          data: config.data,
          params: config.params,
        });

        // Request succeeded on candidate base
        confirmedHost = base;
        apiClient.defaults.baseURL = base;
        console.log("[API Client] Reconnected and switched baseURL to:", base);
        return res;
      } catch (retryErr) {
        // If the candidate server answered with an HTTP error (e.g. 401 Unauthorized),
        // the host is alive and reachable!
        if (retryErr.response) {
          confirmedHost = base;
          apiClient.defaults.baseURL = base;
          console.log("[API Client] Reconnected (server responded) to:", base);
          return Promise.reject(retryErr);
        }
      }
    }

    return Promise.reject(error);
  }
);

export { BASE_URL, getCandidateBases, getCandidateBases as getDynamicHost };
export default apiClient;