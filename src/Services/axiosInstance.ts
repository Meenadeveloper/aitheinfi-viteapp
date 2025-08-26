// axiosInstance.ts
import axios from "axios";
import type {
  AxiosInstance,
//   AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// const navigate = useNavigate();

/**
 * Create an Axios instance with the base URL from environment variables
 * and default headers for JSON communication.
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Create a separate Axios instance for handling multipart file uploads
 * while sharing the same base URL and authorization mechanism.
 */
const apiForFiles: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL as string,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

/**
 * Set Access Token
 */
export const setAccessToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem("access_token", token);
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    apiForFiles.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("access_token");
    delete axiosInstance.defaults.headers["Authorization"];
    delete apiForFiles.defaults.headers["Authorization"];
  }
};

/**
 * Add a request interceptor to include the authorization token
 * in the request headers if it exists in localStorage.
 */
const addAuthInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

/**
 * Add a response interceptor to handle global error scenarios,
 * such as redirecting to the login page on a 401 Unauthorized error.
 */
const addErrorInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access - logging out...");
        localStorage.removeItem("access_token");
        window.location.href = "/";
      } else if (error.response && error.response.status === 403) {
        window.location.href = "/";
      } else if (error.response && error.response.status === 404) {
        console.error("404 Error - Endpoint not found:", error.config?.url);
      } else if (error.response && error.response.status >= 500) {
        console.error("Server error:", error.response?.data);
      }
      return Promise.reject(error);
    }
  );
};

// Apply interceptors
addAuthInterceptor(axiosInstance);
addAuthInterceptor(apiForFiles);
addErrorInterceptor(axiosInstance);
addErrorInterceptor(apiForFiles);

/**
 * Clear all user data from the browser: localStorage, sessionStorage, and cookies.
 */
export const clearUserData = (): void => {
  try {
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    });

    delete axiosInstance.defaults.headers["Authorization"];
    delete apiForFiles.defaults.headers["Authorization"];

    console.log("User data cleared from browser.");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};

/**
 * Convert a given URL resource into a File object
 */
export const urlToFile = async (
  url: string,
  filename: string = "file"
): Promise<File | null> => {
  try {
    // Use axios directly instead of undefined apiClient
    const response = await axiosInstance.get<Blob>(url, {
      responseType: "blob",
    });

    const contentType =
      response.headers["content-type"] ||
      (filename.toLowerCase().endsWith(".png")
        ? "image/png"
        : filename.toLowerCase().endsWith(".webp")
        ? "image/webp"
        : filename.toLowerCase().endsWith(".jpg") ||
          filename.toLowerCase().endsWith(".jpeg")
        ? "image/jpeg"
        : "application/octet-stream");

    return new File([response.data], filename, { type: contentType });
  } catch (error) {
    console.error("urlToFile axios error:", error);
    return null;
  }
};

// Export both instances
export default axiosInstance;
export { apiForFiles };
