import { apiClient } from './index';

export interface CustomerAuthResponse {
  status: number;
  data: {
    id: string;
    fullName: string;
    email?: string;
    phone: string;
    role: string;
    access_token: string;
  };
  message: string;
}

export const customerAuthApi = {
  register: (data: any) => apiClient.post<CustomerAuthResponse>('/customer/auth/register', data),
  login: (data: any) => apiClient.post<CustomerAuthResponse>('/customer/auth/login', data),
  getProfile: () => apiClient.get<any>('/customer/profile'),
  updateProfile: (data: any) => apiClient.patch<any>('/customer/profile', data),
  getMyBookings: (params?: { status?: string }) =>
    apiClient.get<any>('/customer/bookings', { params }),
};
