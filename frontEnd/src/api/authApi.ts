// ==========================================
// Auth API Service
// ==========================================

import { apiClient } from "./index";
import type {
  ApiResponse,
  Admin,
  RegisterRequest,
  LoginRequest,
} from "./types";

export const authApi = {
  /**
   * Đăng ký admin mới
   * POST /api/auth/register
   */
  register(data: RegisterRequest): Promise<ApiResponse<Admin>> {
    return apiClient.post("/auth/register", data);
  },

  /**
   * Đăng nhập
   * POST /api/auth/login
   */
  login(data: LoginRequest): Promise<ApiResponse<Admin>> {
    return apiClient.post("/auth/login", data);
  },

  /**
   * Lấy thông tin admin theo ID
   * GET /api/auth/admin/:id
   */
  getAdminById(id: string): Promise<ApiResponse<Admin>> {
    return apiClient.get(`/auth/admin/${id}`);
  },
};

export default authApi;
