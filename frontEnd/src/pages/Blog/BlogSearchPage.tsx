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
  Chip,
  Breadcrumbs,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  AccessTime,
  Visibility,
  CalendarMonth,
  NavigateNext,
  SearchOff,
} from '@mui/icons-material';
import { useSearchParams, Link } from 'react-router-dom';
import { publicBlogApi } from '@/api/blogApi';
import type { BlogPost } from '@/api/blogTypes';

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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
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
              Tìm kiếm
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h3"
            sx={{ color: '#fff', fontWeight: 800, fontSize: isMobile ? '1.8rem' : '2.5rem' }}
          >
            Kết quả tìm kiếm
          </Typography>
          <Typography variant="body1" sx={{ color: alpha('#fff', 0.8), mt: 1 }}>
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
                          component="img"
                          height="200"
                          image={post.thumbnailUrl || '/placeholder-blog.jpg'}
                          alt={post.title}
                          sx={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        />
                      </Box>
                      <CardContent
                        sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}
                      >
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                          {post.categories?.slice(0, 2).map((cat) => (
                            <Chip
                              key={cat.id}
                              label={cat.name}
                              size="small"
                              sx={{
                                fontSize: '0.65rem',
                                height: 22,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.dark,
                                fontWeight: 600,
                              }}
                            />
                          ))}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1rem',
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

export default BlogSearchPage;
