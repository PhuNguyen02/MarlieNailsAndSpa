import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  Skeleton,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Breadcrumbs,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { AccessTime, Visibility, CalendarMonth, NavigateNext } from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { publicBlogApi } from '@/api/blogApi';
import type { BlogPost, BlogCategory, BlogTag } from '@/api/blogTypes';

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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
          py: isMobile ? 5 : 8,
          px: 3,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Breadcrumbs
            separator={<NavigateNext sx={{ fontSize: 16, color: alpha('#fff', 0.6) }} />}
            sx={{ mb: 2 }}
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
            variant="h3"
            sx={{ color: '#fff', fontWeight: 800, fontSize: isMobile ? '1.8rem' : '2.5rem' }}
          >
            {title}
          </Typography>
          {isCategory && categoryData?.description && (
            <Typography variant="body1" sx={{ color: alpha('#fff', 0.8), mt: 1.5, maxWidth: 600 }}>
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
            <Grid container spacing={3}>
              {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.1),
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                        '& .img': { transform: 'scale(1.05)' },
                      },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      to={`/blog/${post.slug}`}
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                      }}
                    >
                      <Box sx={{ overflow: 'hidden', height: 200 }}>
                        <CardMedia
                          className="img"
                          component="img"
                          height="200"
                          image={post.thumbnailUrl || '/placeholder-blog.jpg'}
                          alt={post.title}
                          sx={{ transition: 'transform 0.5s ease', objectFit: 'cover' }}
                        />
                      </Box>
                      <CardContent
                        sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            lineHeight: 1.4,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            flex: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 2,
                          }}
                        >
                          {post.excerpt}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarMonth sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {post.publishedAt
                                  ? new Date(post.publishedAt).toLocaleDateString('vi-VN')
                                  : 'Draft'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {post.readingTime} min
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {post.viewCount}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
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
    </Box>
  );
};

export default BlogListPage;
