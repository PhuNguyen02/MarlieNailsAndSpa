// Export custom hooks from here
export { useServices, useServicesFlat } from "./useServices";
export type {
  ServiceItem,
  ServicesByCategory,
  FlatServiceItem,
} from "./useServices";
export {
  useEmployees,
  getAvailableStaffForService,
  generateTimeSlots,
} from "./useEmployees";
export type { Staff } from "./useEmployees";
export { useBookingModal } from "./useBookingModal";
export { useBookings } from "./useBookings";
export type { BookingFormData } from "./useBookings";
