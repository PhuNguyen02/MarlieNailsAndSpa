import { apiClient } from './index';

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminBannersApi = {
  getAll: () => apiClient.get<Banner[]>('/admin/banners'),
  getOne: (id: string) => apiClient.get<Banner>(`/admin/banners/${id}`),
  create: (data: Partial<Banner>) => apiClient.post<Banner>('/admin/banners', data),
  update: (id: string, data: Partial<Banner>) => apiClient.patch<Banner>(`/admin/banners/${id}`, data),
  remove: (id: string) => apiClient.delete(`/admin/banners/${id}`),
};

export const publicBannersApi = {
  getBanners: () => apiClient.get<Banner[]>('/banners'),
};
