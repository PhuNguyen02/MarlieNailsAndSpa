import { apiClient } from './index';

export interface DashboardStats {
  todayBookings: number;
  totalRevenue: number;
  newCustomers: number;
  occupancyRate: number;
  recentActivities: {
    id: string;
    customerName: string;
    serviceName: string;
    status: string;
    createdAt: string;
  }[];
}

export const adminDashboardApi = {
  getStats: () => apiClient.get<DashboardStats>('/admin/dashboard/stats'),
};
