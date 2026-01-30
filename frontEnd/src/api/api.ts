// ==========================================
// API Module - Export tất cả API services
// ==========================================

// Base client
export { apiClient } from "./index";

// API Services
export { authApi } from "./authApi";
export { servicesApi, type ServicesFilters } from "./servicesApi";
export { employeesApi, type EmployeesFilters } from "./employeesApi";
export { customersApi } from "./customersApi";
export { timeSlotsApi, type TimeSlotsFilters } from "./timeSlotsApi";
export { bookingsApi } from "./bookingsApi";

// Hooks
export { useApiCall, useApiState, useFetch } from "./hooks";

// Types - Export tất cả types
export type {
  // Base types
  ApiResponse,
  ApiError,

  // Auth types
  Admin,
  RegisterRequest,
  LoginRequest,

  // Service types
  Service,
  PriceType,
  Treatment,
  CreateServiceRequest,
  UpdateServiceRequest,

  // Employee types
  Employee,
  EmployeeRole,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,

  // Customer types
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,

  // Time Slot types
  TimeSlot,
  TimeSlotAvailability,
  CreateTimeSlotRequest,
  UpdateTimeSlotRequest,

  // Booking types
  Booking,
  BookingStatus,
  BookingSummary,
  BookingEmployee,
  BookingFilters,
  CreateBookingRequest,
  UpdateBookingRequest,
  AvailabilityCheckRequest,
  AvailabilityCheckResponse,
  AvailableSlot,
  AvailableEmployeesResponse,

  // Notification types
  Notification,
  NotificationType,
  NotificationStatus,
  PendingNotification,
} from "./types";
