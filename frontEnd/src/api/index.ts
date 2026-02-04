// ==========================================
// Base API Client
// ==========================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.1.10:8080/api";

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
}

// Build URL with query params
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

// Generic fetch wrapper with error handling
async function request<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  endpoint: string,
  data?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const url = buildUrl(endpoint, options?.params);

  const token = localStorage.getItem("admin_token");
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  };

  if (data && (method === "POST" || method === "PATCH")) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    const json = await response.json();

    if (!response.ok) {
      throw {
        statusCode: response.status,
        message: json.message || "An error occurred",
        error: json.error || "Error",
      };
    }

    return json;
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    throw {
      statusCode: 500,
      message: "Network error or server unavailable",
      error: "NetworkError",
    };
  }
}

// API Client methods
export const apiClient = {
  baseURL: API_BASE_URL,

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>("GET", endpoint, undefined, options);
  },

  post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("POST", endpoint, data, options);
  },

  patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("PATCH", endpoint, data, options);
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>("DELETE", endpoint, undefined, options);
  },
};

// Re-export specific APIs
export * from "./authApi";
export * from "./servicesApi";
export * from "./employeesApi";
export * from "./customersApi";
export * from "./timeSlotsApi";
export * from "./bookingsApi";
export * from "./types";

export default apiClient;
