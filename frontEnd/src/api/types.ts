// ==========================================
// TypeScript Types for API Entities
// ==========================================

// Base API Response wrapper
export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

// Error Response
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// ==========================================
// Admin / Auth Types
// ==========================================
export interface Admin {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ==========================================
// Service Types
// ==========================================
export type PriceType = "single" | "range" | "package" | "custom";

export interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  priceType: PriceType;
  singlePrice?: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
  packagePrice?: number;
  packageSessions?: number;
  duration?: string;
  steps?: string[];
  stepsCount?: number;
  zone?: string;
  hasCustomDesign?: boolean;
  isActive: boolean;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  treatments?: Treatment[];
}

export interface CreateServiceRequest {
  name: string;
  category: string;
  priceType: PriceType;
  description?: string;
  singlePrice?: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
  packagePrice?: number;
  packageSessions?: number;
  duration?: string;
  steps?: string[];
  zone?: string;
  hasCustomDesign?: boolean;
}

export interface UpdateServiceRequest {
  name?: string;
  category?: string;
  priceType?: PriceType;
  description?: string;
  singlePrice?: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
  packagePrice?: number;
  packageSessions?: number;
  duration?: string;
  steps?: string[];
  zone?: string;
  hasCustomDesign?: boolean;
  isActive?: boolean;
}

// ==========================================
// Treatment Types
// ==========================================
export interface Treatment {
  id: string;
  name: string;
  description?: string;
  serviceId: string;
}

// ==========================================
// Employee Types
// ==========================================
export type EmployeeRole = "therapist" | "receptionist" | "manager" | "admin";

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  specialization?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  fullName: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  specialization?: string;
}

export interface UpdateEmployeeRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: EmployeeRole;
  specialization?: string;
  isActive?: boolean;
}

// ==========================================
// Customer Types
// ==========================================
export interface Customer {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  notes?: string | null;
  totalVisits: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  bookings?: BookingSummary[];
}

export interface CreateCustomerRequest {
  fullName: string;
  email?: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  notes?: string;
}

export interface UpdateCustomerRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  notes?: string;
}

// ==========================================
// Time Slot Types
// ==========================================
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentBookings: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeSlotRequest {
  startTime: string;
  endTime: string;
  maxCapacity: number;
}

export interface UpdateTimeSlotRequest {
  startTime?: string;
  endTime?: string;
  maxCapacity?: number;
  isActive?: boolean;
}

export interface TimeSlotAvailability {
  available: boolean;
  availableSlots: number;
}

// ==========================================
// Booking Types
// ==========================================
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface BookingSummary {
  id: string;
  bookingDate: string;
  status: BookingStatus;
}

export interface BookingEmployee {
  id: string;
  employee: {
    id: string;
    fullName: string;
    role: EmployeeRole;
    specialization?: string;
  };
}

export interface Booking {
  id: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  service: {
    id: string;
    name: string;
    category: string;
    steps?: string[];
  };
  bookingEmployees: BookingEmployee[];
  timeSlot: {
    id: string;
    startTime: string;
    endTime: string;
  };
  bookingDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface CreateBookingRequest {
  customerId: string;
  serviceId: string;
  employeeIds?: string[];
  bookingDate: string;
  timeSlotId: string;
  numberOfGuests: number;
  totalPrice: number;
  notes?: string;
}

export interface UpdateBookingRequest {
  status?: BookingStatus;
  cancellationReason?: string;
  notes?: string;
}

export interface BookingFilters {
  [key: string]: string | number | boolean | undefined;
  status?: BookingStatus;
  date?: string;
  customerId?: string;
}

export interface AvailabilityCheckRequest {
  date: string;
  timeSlotId: string;
}

export interface AvailabilityCheckResponse {
  date: string;
  timeSlot: TimeSlot;
  availableSlots: number;
  maxCapacity: number;
  currentBookings: number;
  isAvailable: boolean;
}

export interface AvailableSlot {
  date: string;
  timeSlot: {
    id: string;
    startTime: string;
    endTime: string;
  };
  availableSlots: number;
  isAvailable: boolean;
}

export interface AvailableEmployeesResponse {
  date: string;
  timeSlotId: string;
  totalEmployees: number;
  bookedEmployees: number;
  availableEmployees: Employee[];
}

// ==========================================
// Notification Types
// ==========================================
export type NotificationType =
  | "booking_created"
  | "booking_confirmed"
  | "booking_cancelled"
  | "booking_completed"
  | "booking_reminder";

export type NotificationStatus = "pending" | "sent" | "read";

export interface Notification {
  id: string;
  bookingId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  recipientEmail?: string;
  sentAt?: string;
  readAt?: string | null;
  createdAt: string;
}

export interface PendingNotification extends Notification {
  booking: {
    id: string;
    bookingDate: string;
    customer: {
      fullName: string;
      email: string;
    };
  };
}
