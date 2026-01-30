// ==========================================
// Time Slots API Service
// ==========================================

import { apiClient } from "./index";
import type {
  ApiResponse,
  TimeSlot,
  TimeSlotAvailability,
  CreateTimeSlotRequest,
  UpdateTimeSlotRequest,
} from "./types";

export interface TimeSlotsFilters {
  [key: string]: string | number | boolean | undefined;
  active?: boolean;
}

export const timeSlotsApi = {
  /**
   * Lấy danh sách tất cả khung giờ
   * GET /api/admin/time-slots
   */
  getAll(filters?: TimeSlotsFilters): Promise<ApiResponse<TimeSlot[]>> {
    return apiClient.get("/admin/time-slots", { params: filters });
  },

  /**
   * Lấy thông tin khung giờ theo ID
   * GET /api/admin/time-slots/:id
   */
  getById(id: string): Promise<ApiResponse<TimeSlot>> {
    return apiClient.get(`/admin/time-slots/${id}`);
  },

  /**
   * Kiểm tra tình trạng còn chỗ của khung giờ
   * GET /api/admin/time-slots/:id/availability?guests=X
   */
  checkAvailability(
    id: string,
    guests: number,
  ): Promise<ApiResponse<TimeSlotAvailability>> {
    return apiClient.get(`/admin/time-slots/${id}/availability`, {
      params: { guests },
    });
  },

  /**
   * Tạo khung giờ mới
   * POST /api/admin/time-slots
   */
  create(data: CreateTimeSlotRequest): Promise<ApiResponse<TimeSlot>> {
    return apiClient.post("/admin/time-slots", data);
  },

  /**
   * Cập nhật khung giờ
   * PATCH /api/admin/time-slots/:id
   */
  update(
    id: string,
    data: UpdateTimeSlotRequest,
  ): Promise<ApiResponse<TimeSlot>> {
    return apiClient.patch(`/admin/time-slots/${id}`, data);
  },

  /**
   * Xóa khung giờ
   * DELETE /api/admin/time-slots/:id
   */
  delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/admin/time-slots/${id}`);
  },
};

export default timeSlotsApi;
