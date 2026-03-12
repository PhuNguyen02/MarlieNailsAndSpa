import { apiClient } from './index';
import type { Promotion } from './types';

// Public API
export const publicPromotionsApi = {
  getActive() {
    return apiClient.get<Promotion[]>('/promotions/active');
  },
};

// Admin API
export const adminPromotionsApi = {
  getAll() {
    return apiClient.get<Promotion[]>('/admin/promotions');
  },

  getById(id: string) {
    return apiClient.get<Promotion>(`/admin/promotions/${id}`);
  },

  create(data: Partial<Promotion>) {
    return apiClient.post<Promotion>('/admin/promotions', data);
  },

  update(id: string, data: Partial<Promotion>) {
    return apiClient.patch<Promotion>(`/admin/promotions/${id}`, data);
  },

  remove(id: string) {
    return apiClient.delete(`/admin/promotions/${id}`);
  },
};
