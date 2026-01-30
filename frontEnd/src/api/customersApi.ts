// ==========================================
// Customers API Service
// ==========================================

import { apiClient } from "./index";
import type {
  ApiResponse,
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "./types";

export const customersApi = {
  /**
   * Lấy danh sách tất cả khách hàng
   * GET /api/customers
   */
  getAll(): Promise<ApiResponse<Customer[]>> {
    return apiClient.get("/customers");
  },

  /**
   * Lấy thông tin khách hàng theo ID (bao gồm lịch sử booking)
   * GET /api/customers/:id
   */
  getById(id: string): Promise<ApiResponse<Customer>> {
    return apiClient.get(`/customers/${id}`);
  },

  /**
   * Tìm kiếm khách hàng theo số điện thoại
   * GET /api/customers/search/phone/:phone
   */
  getByPhone(phone: string): Promise<ApiResponse<Customer | null>> {
    return apiClient.get(`/customers/search/phone/${phone}`);
  },

  /**
   * Tạo khách hàng mới
   * POST /api/customers
   */
  create(data: CreateCustomerRequest): Promise<ApiResponse<Customer>> {
    return apiClient.post("/customers", data);
  },

  /**
   * Cập nhật thông tin khách hàng
   * PATCH /api/customers/:id
   */
  update(
    id: string,
    data: UpdateCustomerRequest,
  ): Promise<ApiResponse<Customer>> {
    return apiClient.patch(`/customers/${id}`, data);
  },

  /**
   * Xóa khách hàng
   * DELETE /api/customers/:id
   */
  delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/customers/${id}`);
  },
};

export default customersApi;
