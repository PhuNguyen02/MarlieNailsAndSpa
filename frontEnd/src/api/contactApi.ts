// ==========================================
// Contact API Service
// ==========================================

import { apiClient } from './index';
import type { ContactMessage, CreateContactRequest } from './types';

interface PaginatedContacts {
  items: ContactMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Public API
export const publicContactApi = {
  send(data: CreateContactRequest) {
    return apiClient.post<{ id: string; createdAt: string }>('/contact', data);
  },
};

// Admin API
export const adminContactApi = {
  getAll(params?: { page?: number; limit?: number; isRead?: string }) {
    return apiClient.get<PaginatedContacts>('/admin/contact', {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  getStats() {
    return apiClient.get<{ total: number; unread: number }>('/admin/contact/stats');
  },

  markAsRead(id: string) {
    return apiClient.patch<ContactMessage>(`/admin/contact/${id}/read`);
  },

  remove(id: string) {
    return apiClient.delete(`/admin/contact/${id}`);
  },
};
