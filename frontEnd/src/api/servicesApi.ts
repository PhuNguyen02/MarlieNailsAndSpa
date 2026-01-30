// ==========================================
// Services API Service
// ==========================================

import { apiClient } from "./index";
import type {
  ApiResponse,
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
} from "./types";

export interface ServicesFilters {
  [key: string]: string | number | boolean | undefined;
  active?: boolean;
}

export const servicesApi = {
  /**
   * Lấy danh sách tất cả dịch vụ
   * GET /api/admin/services
   */
  getAll(filters?: ServicesFilters): Promise<ApiResponse<Service[]>> {
    return apiClient.get("/admin/services", { params: filters });
  },

  /**
   * Lấy thông tin dịch vụ theo ID
   * GET /api/admin/services/:id
   */
  getById(id: string): Promise<ApiResponse<Service>> {
    return apiClient.get(`/admin/services/${id}`);
  },

  /**
   * Tạo dịch vụ mới
   * POST /api/admin/services
   */
  create(data: CreateServiceRequest): Promise<ApiResponse<Service>> {
    return apiClient.post("/admin/services", data);
  },

  /**
   * Cập nhật dịch vụ
   * PATCH /api/admin/services/:id
   */
  update(
    id: string,
    data: UpdateServiceRequest,
  ): Promise<ApiResponse<Service>> {
    return apiClient.patch(`/admin/services/${id}`, data);
  },

  /**
   * Xóa dịch vụ
   * DELETE /api/admin/services/:id
   */
  delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/admin/services/${id}`);
  },
};

export default servicesApi;
