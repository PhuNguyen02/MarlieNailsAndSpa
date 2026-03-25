import { apiClient } from './index';
import type { Testimonial } from './types';

// Public API
export const publicTestimonialsApi = {
  getActive() {
    return apiClient.get<Testimonial[]>('/testimonials/active');
  },
};

// Admin API
export const adminTestimonialsApi = {
  getAll() {
    return apiClient.get<Testimonial[]>('/admin/testimonials');
  },

  getById(id: string) {
    return apiClient.get<Testimonial>(`/admin/testimonials/${id}`);
  },

  create(data: Partial<Testimonial>) {
    return apiClient.post<Testimonial>('/admin/testimonials', data);
  },

  update(id: string, data: Partial<Testimonial>) {
    return apiClient.patch<Testimonial>(`/admin/testimonials/${id}`, data);
  },

  remove(id: string) {
    return apiClient.delete(`/admin/testimonials/${id}`);
  },
};
