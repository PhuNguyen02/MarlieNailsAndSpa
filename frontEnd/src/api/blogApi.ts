// ==========================================
// Blog API Service
// ==========================================

import { apiClient } from './index';
import type {
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogComment,
  MediaFile,
  PaginatedResponse,
  BlogStats,
  CommentStats,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCategoryRequest,
  CreateTagRequest,
  CreateCommentRequest,
  PostStatus,
} from './blogTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// ==========================================
// Admin Blog API
// ==========================================
export const adminBlogApi = {
  // Posts
  getPosts: (params?: { page?: number; limit?: number; status?: PostStatus; search?: string }) =>
    apiClient.get<PaginatedResponse<BlogPost>>('/admin/blog/posts', {
      params: params as Record<string, string | number | boolean | undefined>,
    }),

  getPost: (id: string) => apiClient.get<BlogPost>(`/admin/blog/posts/${id}`),

  createPost: (data: CreatePostRequest) => apiClient.post<BlogPost>('/admin/blog/posts', data),

  updatePost: (id: string, data: UpdatePostRequest) =>
    apiClient.patch<BlogPost>(`/admin/blog/posts/${id}`, data),

  deletePost: (id: string) => apiClient.delete(`/admin/blog/posts/${id}`),

  getPostStats: () => apiClient.get<BlogStats>('/admin/blog/posts/stats'),

  // Categories
  getCategories: () => apiClient.get<BlogCategory[]>('/admin/blog/categories'),

  createCategory: (data: CreateCategoryRequest) =>
    apiClient.post<BlogCategory>('/admin/blog/categories', data),

  updateCategory: (id: string, data: Partial<CreateCategoryRequest>) =>
    apiClient.patch<BlogCategory>(`/admin/blog/categories/${id}`, data),

  deleteCategory: (id: string) => apiClient.delete(`/admin/blog/categories/${id}`),

  // Tags
  getTags: () => apiClient.get<BlogTag[]>('/admin/blog/tags'),

  createTag: (data: CreateTagRequest) => apiClient.post<BlogTag>('/admin/blog/tags', data),

  deleteTag: (id: string) => apiClient.delete(`/admin/blog/tags/${id}`),

  // Comments
  getComments: (params?: {
    page?: number;
    limit?: number;
    isApproved?: boolean;
    postId?: string;
  }) =>
    apiClient.get<PaginatedResponse<BlogComment>>('/admin/blog/comments', {
      params: params as Record<string, string | number | boolean | undefined>,
    }),

  getCommentStats: () => apiClient.get<CommentStats>('/admin/blog/comments/stats'),

  approveComment: (id: string) => apiClient.post<BlogComment>(`/admin/blog/comments/${id}/approve`),

  replyComment: (id: string, content: string) =>
    apiClient.post<BlogComment>(`/admin/blog/comments/${id}/reply`, { content }),

  deleteComment: (id: string) => apiClient.delete(`/admin/blog/comments/${id}`),

  // Media
  getMedia: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<MediaFile>>('/admin/blog/media', {
      params: params as Record<string, string | number | boolean | undefined>,
    }),

  uploadMedia: async (file: File): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/blog/media/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw { statusCode: response.status, message: error.message };
    }

    return response.json();
  },

  deleteMedia: (id: string) => apiClient.delete(`/admin/blog/media/${id}`),
};

// ==========================================
// Public Blog API
// ==========================================
export const publicBlogApi = {
  getPosts: (params?: { page?: number; limit?: number; category?: string; tag?: string }) =>
    apiClient.get<PaginatedResponse<BlogPost>>('/blog', {
      params: params as Record<string, string | number | boolean | undefined>,
    }),

  getFeaturedPosts: (limit?: number) =>
    apiClient.get<BlogPost[]>('/blog/featured', {
      params: limit ? { limit } : undefined,
    }),

  getPost: (slug: string) => apiClient.get<BlogPost>(`/blog/${slug}`),

  getRelatedPosts: (slug: string, limit?: number) =>
    apiClient.get<BlogPost[]>(`/blog/${slug}/related`, {
      params: limit ? { limit } : undefined,
    }),

  search: (q: string, page?: number, limit?: number) =>
    apiClient.get<PaginatedResponse<BlogPost>>('/blog/search', {
      params: { q, page, limit } as Record<string, string | number | boolean | undefined>,
    }),

  getCategories: () => apiClient.get<BlogCategory[]>('/blog/categories'),

  getTags: () => apiClient.get<BlogTag[]>('/blog/tags'),

  getComments: (slug: string) => apiClient.get<BlogComment[]>(`/blog/${slug}/comments`),

  addComment: (slug: string, data: CreateCommentRequest) =>
    apiClient.post<BlogComment>(`/blog/${slug}/comments`, data),
};
