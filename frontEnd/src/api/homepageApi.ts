import { apiClient } from './index';

export enum SectionType {
  HERO = 'hero',
  SERVICES = 'services',
  USP = 'usp',
  PROMOTION = 'promotion',
  BLOG = 'blog',
  ABOUT = 'about',
  WELLNESS = 'wellness',
  WORKING_HOURS = 'working_hours',
  PRICING = 'pricing',
  TESTIMONIALS = 'testimonials',
  CUSTOM = 'custom',
}

export interface HomepageSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  config: any;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminHomepageApi = {
  getAll: () => apiClient.get<HomepageSection[]>('/admin/homepage'),
  create: (data: Partial<HomepageSection>) => apiClient.post<HomepageSection>('/admin/homepage', data),
  update: (id: string, data: Partial<HomepageSection>) => apiClient.patch<HomepageSection>(`/admin/homepage/${id}`, data),
  remove: (id: string) => apiClient.delete(`/admin/homepage/${id}`),
  reorder: (ids: string[]) => apiClient.post('/admin/homepage/reorder', { ids }),
};

export const publicHomepageApi = {
  getSections: () => apiClient.get<HomepageSection[]>('/homepage/sections'),
};
