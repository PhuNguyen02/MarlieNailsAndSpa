// ==========================================
// Custom Hook for Bookings API
// ==========================================

import { useState, useCallback } from "react";
import bookingsApi from "../api/bookingsApi";
import customersApi from "../api/customersApi";
import type { CreateBookingRequest, Booking } from "../api/types";

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  numberOfGuests: number;
  bookings: {
    guestNumber: number;
    serviceId: string;
    date: string;
    time: string; // This is actually timeSlotId
    employeeId?: string;
    price?: number;
  }[];
  note?: string;
  totalPrice?: number;
}

export function useBookings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available slots for a date
  // Fetch available slots for a date
  const getAvailableSlots = useCallback(
    async (date: string, serviceId?: string, employeeId?: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookingsApi.getAvailableSlots(
          date,
          serviceId,
          employeeId,
        );
        return response.data || [];
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setError("Không thể tải danh sách khung giờ trống");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch all active employees (Step 1)
  const getActiveBookableEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingsApi.getActiveEmployees();
      return response.data || [];
    } catch (err) {
      console.error("Error fetching employees:", err);
      // setError("Không thể tải danh sách nhân viên"); // Optional
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch available employees for a date and slot
  const getAvailableEmployees = useCallback(
    async (date: string, timeSlotId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookingsApi.getAvailableEmployees(
          date,
          timeSlotId,
        );
        return response.data?.availableEmployees || [];
      } catch (err) {
        console.error("Error fetching available employees:", err);
        setError("Không thể tải danh sách nhân viên trống");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Submit multiple bookings
  const submitBooking = async (formData: BookingFormData) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Find or create customer
      let customerId: string;
      const customerSearchResponse = await customersApi.getByPhone(
        formData.phone,
      );

      if (customerSearchResponse.data) {
        customerId = customerSearchResponse.data.id;
      } else {
        const createCustomerResponse = await customersApi.create({
          fullName: formData.name,
          phone: formData.phone,
          email: formData?.email || undefined,
        });
        if (createCustomerResponse.data) {
          customerId = createCustomerResponse.data.id;
        } else {
          throw new Error("Không thể tạo khách hàng mới");
        }
      }

      // 2. Submit bookings
      // In current backend, one booking has numberOfGuests and ONE serviceId.
      // If guests have different services, we might need to send multiple bookings
      // or pick the first guest's service as primary and list others in notes.

      // Let's assume for now we group by date and time
      const groupedBookings: Record<string, typeof formData.bookings> = {};
      formData.bookings.forEach((b) => {
        const key = `${b.date}_${b.time}`;
        if (!groupedBookings[key]) groupedBookings[key] = [];
        groupedBookings[key].push(b);
      });

      const results: Booking[] = [];

      for (const key of Object.keys(groupedBookings)) {
        const [date, timeSlotId] = key.split("_");
        const bookingsInSlot = groupedBookings[key];

        // Pick primary service (first guest)
        const primaryServiceId = bookingsInSlot[0].serviceId;
        const employeeIds = bookingsInSlot
          .map((b) => b.employeeId)
          .filter((id) => !!id) as string[];

        // Build notes with other services if they differ
        let extendedNotes = formData.note || "";
        if (bookingsInSlot.length > 1) {
          const guestDetails = bookingsInSlot
            .map(
              (b, i) =>
                `Khách ${i + 1}: Dịch vụ ID ${b.serviceId}${b.employeeId ? `, NV ${b.employeeId}` : ""}`,
            )
            .join("\n");
          extendedNotes = `${extendedNotes}\n\nChi tiết khách hàng:\n${guestDetails}`;
        }

        const bookingRequest: CreateBookingRequest = {
          customerId,
          bookingDate: date,
          timeSlotId,
          numberOfGuests: bookingsInSlot.length,
          serviceId: primaryServiceId,
          employeeIds: employeeIds.length > 0 ? employeeIds : undefined,
          totalPrice:
            formData.totalPrice ||
            bookingsInSlot.reduce((sum, b) => sum + (b.price || 0), 0),
          notes: extendedNotes,
        };

        const response = await bookingsApi.create(bookingRequest);
        if (response.data) {
          results.push(response.data);
        }
      }

      return results;
    } catch (err: any) {
      console.error("Error submitting booking:", err);
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi đặt lịch");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAvailableSlots,
    getAvailableEmployees,
    getActiveBookableEmployees,
    submitBooking,
  };
}

export default useBookings;
