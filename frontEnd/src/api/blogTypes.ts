// ==========================================
// Blog API Types
// ==========================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  thumbnailUrl: string | null;
  status: PostStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  viewCount: number;
  readingTime: number;
  isFeatured: boolean;
  authorId: string | null;
  author?: BlogAuthor;
  categories?: BlogCategory[];
  tags?: BlogTag[];
  comments?: BlogComment[];
  createdAt: string;
  updatedAt: string;
}

export type PostStatus = 'draft' | 'published' | 'scheduled';

export interface BlogAuthor {
  id: string;
  fullName: string;
  email?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
  createdAt: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  parentId: string | null;
  authorName: string;
  authorEmail: string;
  content: string;
  isApproved: boolean;
  post?: { id: string; title: string; slug: string };
  replies?: BlogComment[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedById: string | null;
  uploadedBy?: BlogAuthor;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}

export interface CommentStats {
  totalComments: number;
  pendingComments: number;
  approvedComments: number;
}

export interface CreatePostRequest {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  thumbnailUrl?: string;
  status?: PostStatus;
  scheduledAt?: string;
  isFeatured?: boolean;
  categoryIds?: string[];
  tagIds?: string[];
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {}

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
}

export interface CreateTagRequest {
  name: string;
  slug?: string;
}

export interface CreateCommentRequest {
  authorName: string;
  authorEmail: string;
  content: string;
  parentId?: string;
}
