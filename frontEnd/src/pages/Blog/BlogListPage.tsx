import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  Skeleton,
  Breadcrumbs,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { publicBlogApi } from '@/api/blogApi';
import type { BlogPost, BlogCategory, BlogTag } from '@/api/blogTypes';
import BlogPostCard from '@/components/Blog/BlogPostCard';
import MainLayout from '@/components/MainLayout/MainLayout';

const BlogListPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const isCategory = window.location.pathname.includes('/category/');
  const isTag = window.location.pathname.includes('/tag/');

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<BlogCategory | null>(null);
  const [tagData, setTagData] = useState<BlogTag | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchData = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const params: Record<string, string | number | undefined> = { page: p, limit: 9 };
        if (isCategory && slug) params.category = slug;
        if (isTag && slug) params.tag = slug;

        const data = await publicBlogApi.getPosts(params as any);
        setPosts(data.items);
        setTotalPages(data.totalPages);

        // Fetch category/tag details
        if (isCategory && slug) {
          const cats = await publicBlogApi.getCategories();
          setCategoryData(cats.find((c) => c.slug === slug) || null);
        }
        if (isTag && slug) {
          const tgs = await publicBlogApi.getTags();
          setTagData(tgs.find((t) => t.slug === slug) || null);
        }
      } catch {
        console.error('Failed to fetch posts');
      }
      setLoading(false);
    },
    [slug, isCategory, isTag],
  );

  useEffect(() => {
    setPage(1);
    fetchData(1);
  }, [slug, fetchData]);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  const title = isCategory
    ? categoryData?.name || 'Chuyên mục'
    : isTag
      ? `#${tagData?.name || 'Tag'}`
      : 'Tất cả bài viết';

  return (
    <MainLayout>
      {/* Hero Header */}
      <Box
        sx={{
          position: 'relative',
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/blog-hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          py: isMobile ? 8 : 12,
          px: 3,
          mb: 6,
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <Container maxWidth="lg">
          <Breadcrumbs
            separator={<NavigateNext sx={{ fontSize: 16, color: alpha('#fff', 0.6) }} />}
            sx={{ mb: 2, justifyContent: 'center', display: 'flex' }}
          >
            <Link
              to="/blog"
              style={{ color: alpha('#fff', 0.6), textDecoration: 'none', fontSize: '0.875rem' }}
            >
              Blog
            </Link>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
              {title}
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h2"
            sx={{ 
              color: '#fff', 
              fontWeight: 900, 
              fontSize: isMobile ? '2.5rem' : '4rem',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            {title}
          </Typography>
          {isCategory && categoryData?.description && (
            <Typography variant="h6" sx={{ color: alpha('#fff', 0.9), mt: 2, maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
              {categoryData.description}
            </Typography>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={360} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Grid container spacing={4}>
              {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <BlogPostCard post={post} />
                </Grid>
              ))}
            </Grid>

            {posts.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Không tìm thấy bài viết nào.
                </Typography>
              </Box>
            )}

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </MainLayout>
  );
};

export default BlogListPage;
