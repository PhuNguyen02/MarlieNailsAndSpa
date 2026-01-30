// ==========================================
// Bookings API Service
// ==========================================

import { apiClient } from "./index";
import type {
  ApiResponse,
  Booking,
  BookingFilters,
  CreateBookingRequest,
  UpdateBookingRequest,
  AvailabilityCheckRequest,
  AvailabilityCheckResponse,
  AvailableSlot,
  AvailableEmployeesResponse,
  Notification,
  PendingNotification,
} from "./types";

export const bookingsApi = {
  // ==========================================
  // Booking CRUD
  // ==========================================

  /**
   * Lấy danh sách tất cả booking
   * GET /api/bookings
   * @param filters - Lọc theo status, date, customerId
   */
  getAll(filters?: BookingFilters): Promise<ApiResponse<Booking[]>> {
    return apiClient.get("/bookings", { params: filters });
  },

  /**
   * Lấy thông tin booking theo ID
   * GET /api/bookings/:id
   */
  getById(id: string): Promise<ApiResponse<Booking>> {
    return apiClient.get(`/bookings/${id}`);
  },

  /**
   * Tạo booking mới
   * POST /api/bookings
   */
  create(data: CreateBookingRequest): Promise<ApiResponse<Booking>> {
    return apiClient.post("/bookings", data);
  },

  /**
   * Cập nhật booking (confirm, cancel, complete)
   * PATCH /api/bookings/:id
   */
  update(
    id: string,
    data: UpdateBookingRequest,
  ): Promise<ApiResponse<Booking>> {
    return apiClient.patch(`/bookings/${id}`, data);
  },

  /**
   * Xóa booking
   * DELETE /api/bookings/:id
   */
  delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/bookings/${id}`);
  },

  // ==========================================
  // Booking Status Updates
  // ==========================================

  /**
   * Xác nhận booking
   */
  confirm(id: string): Promise<ApiResponse<Booking>> {
    return apiClient.patch(`/bookings/${id}`, { status: "confirmed" });
  },

  /**
   * Hoàn thành booking
   */
  complete(id: string): Promise<ApiResponse<Booking>> {
    return apiClient.patch(`/bookings/${id}`, { status: "completed" });
  },

  /**
   * Hủy booking
   * @param id - Booking ID
   * @param reason - Lý do hủy
   */
  cancel(id: string, reason?: string): Promise<ApiResponse<Booking>> {
    return apiClient.patch(`/bookings/${id}`, {
      status: "cancelled",
      cancellationReason: reason,
    });
  },

  // ==========================================
  // Availability Checking
  // ==========================================

  /**
   * Kiểm tra tình trạng còn chỗ
   * POST /api/bookings/check-availability
   */
  checkAvailability(
    data: AvailabilityCheckRequest,
  ): Promise<ApiResponse<AvailabilityCheckResponse>> {
    return apiClient.post("/bookings/check-availability", data);
  },

  /**
   * Lấy danh sách khung giờ còn trống cho ngày cụ thể
   * GET /api/bookings/available-slots/:date
   */
  getAvailableSlots(
    date: string,
    serviceId?: string,
    employeeId?: string,
  ): Promise<ApiResponse<AvailableSlot[]>> {
    return apiClient.get(`/bookings/available-slots/${date}`, {
      params: { serviceId, employeeId },
    });
  },

  /**
   * Lấy danh sách nhân viên đang hoạt động (cho booking step 1)
   * GET /api/bookings/employees
   */
  getActiveEmployees(): Promise<ApiResponse<any[]>> {
    return apiClient.get("/bookings/employees");
  },

  /**
   * Lấy danh sách nhân viên còn trống
   * GET /api/bookings/available-employees?date=...&timeSlotId=...
   */
  getAvailableEmployees(
    date: string,
    timeSlotId: string,
  ): Promise<ApiResponse<AvailableEmployeesResponse>> {
    return apiClient.get("/bookings/available-employees", {
      params: { date, timeSlotId },
    });
  },

  // ==========================================
  // Notifications
  // ==========================================

  /**
   * Lấy danh sách thông báo của booking
   * GET /api/bookings/:id/notifications
   */
  getNotifications(bookingId: string): Promise<ApiResponse<Notification[]>> {
    return apiClient.get(`/bookings/${bookingId}/notifications`);
  },

  /**
   * Lấy danh sách thông báo chờ xử lý
   * GET /api/bookings/notifications/pending
   */
  getPendingNotifications(): Promise<ApiResponse<PendingNotification[]>> {
    return apiClient.get("/bookings/notifications/pending");
  },

  /**
   * Đánh dấu thông báo đã đọc
   * PATCH /api/bookings/notifications/:id/read
   */
  markNotificationRead(
    notificationId: string,
  ): Promise<ApiResponse<Notification>> {
    return apiClient.patch(`/bookings/notifications/${notificationId}/read`);
  },
};

export default bookingsApi;
