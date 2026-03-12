import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Chip,
  Grid,
  Pagination,
  Skeleton,
  IconButton,
  InputBase,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  AccessTime,
  Visibility,
  Search as SearchIcon,
  ArrowForward,
  CalendarMonth,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { publicBlogApi } from '@/api/blogApi';
import type { BlogPost, BlogCategory, BlogTag } from '@/api/blogTypes';

// ==========================================
// Featured Slider Component
// ==========================================
const FeaturedSlider: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (posts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posts.length]);

  if (!posts.length) return null;
  const post = posts[activeIndex];

  return (
    <Box
      sx={{
        position: 'relative',
        height: isMobile ? 400 : 520,
        borderRadius: 4,
        overflow: 'hidden',
        mb: 6,
        cursor: 'pointer',
        '&:hover .slider-overlay': { opacity: 0.85 },
      }}
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      <Box
        component="img"
        src={post.thumbnailUrl || '/placeholder-blog.jpg'}
        alt={post.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s ease',
          '&:hover': { transform: 'scale(1.03)' },
        }}
      />
      <Box
        className="slider-overlay"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          p: isMobile ? 3 : 5,
          transition: 'opacity 0.3s ease',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {post.categories?.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.9),
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          ))}
          <Chip
            icon={<AccessTime sx={{ fontSize: 14, color: '#fff !important' }} />}
            label={`${post.readingTime} min read`}
            size="small"
            sx={{ bgcolor: alpha('#fff', 0.2), color: '#fff', fontSize: '0.7rem' }}
          />
        </Box>
        <Typography
          variant={isMobile ? 'h5' : 'h3'}
          sx={{ color: '#fff', fontWeight: 700, mb: 1, lineHeight: 1.2 }}
        >
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: alpha('#fff', 0.85), maxWidth: 600, lineHeight: 1.6 }}
        >
          {post.excerpt}
        </Typography>
      </Box>

      {/* Dots indicator */}
      {posts.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 24,
            display: 'flex',
            gap: 1,
          }}
        >
          {posts.map((_, i) => (
            <Box
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(i);
              }}
              sx={{
                width: activeIndex === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: activeIndex === i ? '#fff' : alpha('#fff', 0.4),
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

// ==========================================
// Blog Post Card Component
// ==========================================
const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const theme = useTheme();

  return (
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
          '& .card-image': { transform: 'scale(1.05)' },
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/blog/${post.slug}`}
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
          <CardMedia
            className="card-image"
            component="img"
            height="200"
            image={post.thumbnailUrl || '/placeholder-blog.jpg'}
            alt={post.title}
            sx={{ transition: 'transform 0.5s ease', objectFit: 'cover' }}
          />
          {post.isFeatured && (
            <Chip
              label="Featured"
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.65rem',
              }}
            />
          )}
        </Box>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
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
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            {post.excerpt}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 'auto',
            }}
          >
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
  );
};

// ==========================================
// Blog Home Page
// ==========================================
const BlogHomePage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featured, setFeatured] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const fetchPosts = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await publicBlogApi.getPosts({ page: p, limit: 9 });
      setPosts(data.items);
      setTotalPages(data.totalPages);
    } catch {
      console.error('Failed to fetch posts');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const [feat, cats, tgs] = await Promise.all([
          publicBlogApi.getFeaturedPosts(5),
          publicBlogApi.getCategories(),
          publicBlogApi.getTags(),
        ]);
        setFeatured(feat);
        setCategories(cats);
        setTags(tgs);
      } catch {
        console.error('Failed to fetch sidebar data');
      }
    };
    fetchSidebar();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
          py: isMobile ? 6 : 10,
          px: 3,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              color: '#fff',
              fontWeight: 800,
              mb: 2,
              fontSize: isMobile ? '2rem' : '3rem',
            }}
          >
            Blog
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: alpha('#fff', 0.8),
              fontWeight: 400,
              mb: 4,
              maxWidth: 500,
            }}
          >
            Tips chăm sóc sắc đẹp, xu hướng nail mới nhất và những chia sẻ từ Marlie Nails & Spa.
          </Typography>

          {/* Search Bar */}
          <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              alignItems: 'center',
              maxWidth: 500,
              borderRadius: 50,
              px: 2.5,
              py: 0.5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, fontSize: '0.95rem' }}
            />
            <IconButton type="submit" size="small">
              <ArrowForward />
            </IconButton>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Featured Slider */}
        {featured.length > 0 && <FeaturedSlider posts={featured} />}

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Bài viết mới nhất
            </Typography>

            {loading ? (
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Skeleton variant="rounded" height={360} sx={{ borderRadius: 3 }} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <>
                <Grid container spacing={3}>
                  {posts.map((post) => (
                    <Grid item xs={12} sm={6} key={post.id}>
                      <BlogPostCard post={post} />
                    </Grid>
                  ))}
                </Grid>

                {posts.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      Chưa có bài viết nào.
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
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Categories */}
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.08),
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Chuyên mục
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {categories.map((cat) => (
                  <Box
                    key={cat.id}
                    component={Link}
                    to={`/blog/category/${cat.slug}`}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: 'text.primary',
                      py: 1,
                      px: 1.5,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {cat.name}
                    </Typography>
                    <Chip label={cat.postCount || 0} size="small" sx={{ height: 22 }} />
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Tags */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.08),
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Thẻ phổ biến
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={`#${tag.name}`}
                    component={Link}
                    to={`/blog/tag/${tag.slug}`}
                    clickable
                    size="small"
                    sx={{
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        color: theme.palette.primary.dark,
                      },
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogHomePage;
