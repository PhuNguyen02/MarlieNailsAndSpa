// ==========================================
// Custom Hook for Employees API
// ==========================================

import { useState, useEffect, useCallback } from "react";
import employeesApi from "../api/employeesApi";
import type { ApiResponse, Employee } from "../api/types";

// Interface matching the component expectations (from staff.ts)
export interface Staff {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  specialties: string[];
  workingHours: {
    start: string;
    end: string;
  };
  status: "available" | "busy" | "off";
}

// Transform API Employee to Staff
const transformEmployee = (employee: Employee): Staff => {
  // Map role to position
  const positionMap: Record<string, string> = {
    therapist: "Chuyên viên",
    receptionist: "Lễ tân",
    manager: "Quản lý",
    admin: "Admin",
  };

  // Map specialization to specialties array
  const specialties = employee.specialization
    ? employee.specialization.split(",").map((s) => s.trim())
    : [];

  return {
    id: employee.id,
    name: employee.fullName,
    position: positionMap[employee.role] || "Nhân viên",
    specialties,
    workingHours: {
      start: "09:00",
      end: "18:00",
    },
    status: employee.isActive ? "available" : "off",
  };
};

export interface UseEmployeesResult {
  employees: Employee[];
  staff: Staff[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEmployees(filterTherapists = true): UseEmployeesResult {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = filterTherapists
        ? { role: "therapist" as const, isActive: true }
        : { isActive: true };
      const response: ApiResponse<Employee[]> =
        await employeesApi.getAll(filters);
      setEmployees(response.data || []);
    } catch (err) {
      setError("Không thể tải danh sách nhân viên");
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  }, [filterTherapists]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const staff = employees.map(transformEmployee);

  return {
    employees,
    staff,
    loading,
    error,
    refetch: fetchEmployees,
  };
}

// Helper function to get staff available for a service category
export function getAvailableStaffForService(
  staff: Staff[],
  serviceCategory: string,
): Staff[] {
  return staff.filter(
    (s) =>
      s.status === "available" &&
      (s.specialties.length === 0 ||
        s.specialties.some((specialty) =>
          serviceCategory.toLowerCase().includes(specialty.toLowerCase()),
        )),
  );
}

// Generate time slots (30-minute intervals)
export function generateTimeSlots(
  startTime: string,
  endTime: string,
): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const timeString = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;
    slots.push(timeString);

    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour += 1;
    }
  }

  return slots;
}

export default useEmployees;
