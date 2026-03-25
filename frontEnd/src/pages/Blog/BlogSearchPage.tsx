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
import {
  NavigateNext,
  SearchOff,
} from '@mui/icons-material';
import { useSearchParams, Link } from 'react-router-dom';
import { publicBlogApi } from '@/api/blogApi';
import type { BlogPost } from '@/api/blogTypes';
import BlogPostCard from '@/components/Blog/BlogPostCard';
import MainLayout from '@/components/MainLayout/MainLayout';

const BlogSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchResults = useCallback(
    async (p: number) => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await publicBlogApi.search(query, p, 9);
        setPosts(data.items);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch {
        console.error('Search failed');
      }
      setLoading(false);
    },
    [query],
  );

  useEffect(() => {
    setPage(1);
    fetchResults(1);
  }, [query, fetchResults]);

  useEffect(() => {
    fetchResults(page);
  }, [page, fetchResults]);

  return (
    <MainLayout>
      {/* Header */}
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
              Tìm kiếm
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h2"
            sx={{ 
              color: '#fff', 
              fontWeight: 900, 
              fontSize: isMobile ? '2.5rem' : '4rem',
              textShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}
          >
            Kết quả tìm kiếm
          </Typography>
          <Typography variant="h6" sx={{ color: alpha('#fff', 0.9), mt: 2, fontWeight: 400 }}>
            {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${total} kết quả cho "${query}"`}
          </Typography>
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
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <SearchOff sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.4 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Không tìm thấy kết quả
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hãy thử tìm kiếm với từ khóa khác.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <BlogPostCard post={post} />
                </Grid>
              ))}
            </Grid>

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

export default BlogSearchPage;
