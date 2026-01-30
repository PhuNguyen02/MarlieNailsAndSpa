// ==========================================
// Employees API Service
// ==========================================

import { apiClient } from "./index";
import type {
  ApiResponse,
  Employee,
  EmployeeRole,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from "./types";

export interface EmployeesFilters {
  [key: string]: string | number | boolean | undefined;
  role?: EmployeeRole;
  isActive?: boolean;
}

export const employeesApi = {
  /**
   * Lấy danh sách tất cả nhân viên
   * GET /api/admin/employees
   */
  getAll(filters?: EmployeesFilters): Promise<ApiResponse<Employee[]>> {
    return apiClient.get("/admin/employees", { params: filters });
  },

  /**
   * Lấy thông tin nhân viên theo ID
   * GET /api/admin/employees/:id
   */
  getById(id: string): Promise<ApiResponse<Employee>> {
    return apiClient.get(`/admin/employees/${id}`);
  },

  /**
   * Tạo nhân viên mới
   * POST /api/admin/employees
   */
  create(data: CreateEmployeeRequest): Promise<ApiResponse<Employee>> {
    return apiClient.post("/admin/employees", data);
  },

  /**
   * Cập nhật thông tin nhân viên
   * PATCH /api/admin/employees/:id
   */
  update(
    id: string,
    data: UpdateEmployeeRequest,
  ): Promise<ApiResponse<Employee>> {
    return apiClient.patch(`/admin/employees/${id}`, data);
  },

  /**
   * Xóa nhân viên
   * DELETE /api/admin/employees/:id
   */
  delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/admin/employees/${id}`);
  },
};

export default employeesApi;
