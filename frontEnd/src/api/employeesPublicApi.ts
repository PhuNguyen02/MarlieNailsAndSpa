import { apiClient } from './index';

export interface Employee {
  id: string;
  fullName: string;
  role: string;
  specialization?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export const publicEmployeesApi = {
  getActive() {
    return apiClient.get<{ data: Employee[] }>('/employees/active');
  },
};
