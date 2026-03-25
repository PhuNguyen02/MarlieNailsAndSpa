import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
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
  Search as SearchIcon,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { publicBlogApi } from '@/api/blogApi';
import type { BlogPost, BlogCategory, BlogTag } from '@/api/blogTypes';
import BlogPostCard from '@/components/Blog/BlogPostCard';
import MainLayout from '@/components/MainLayout/MainLayout';

// ==========================================
// Featured Slider Component
// ==========================================
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
    }, 6000);
    return () => clearInterval(interval);
  }, [posts.length]);

  if (!posts.length) return null;
  const post = posts[activeIndex];

  return (
    <Box
      sx={{
        position: 'relative',
        height: isMobile ? 450 : 600,
        borderRadius: 6,
        overflow: 'hidden',
        mb: 8,
        cursor: 'pointer',
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        '&:hover .slider-image': { transform: 'scale(1.05)' },
        '&:hover .slider-overlay': { bgcolor: alpha('#000', 0.45) },
      }}
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      <Box
        component="img"
        className="slider-image"
        src={post.thumbnailUrl || '/images/blog-placeholder-1.png'}
        alt={post.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 10s ease-out',
        }}
      />
      <Box
        className="slider-overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: isMobile ? 4 : 8,
          transition: 'background-color 0.4s ease',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
            {post.categories?.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                size="small"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  px: 1,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              />
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: alpha('#fff', 0.8) }}>
              <AccessTime sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {post.readingTime} min read
              </Typography>
            </Box>
          </Box>
          
          <Typography
            variant={isMobile ? 'h4' : 'h2'}
            sx={{ 
              color: '#fff', 
              fontWeight: 800, 
              mb: 2.5, 
              lineHeight: 1.1,
              maxWidth: 900,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            {post.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{ 
              color: alpha('#fff', 0.9), 
              maxWidth: 700, 
              lineHeight: 1.6,
              fontWeight: 400,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Box 
            sx={{ 
              width: 40, 
              height: 2, 
              bgcolor: theme.palette.primary.main,
              mr: 1
            }} 
          />
          <Typography 
            variant="button" 
            sx={{ 
              color: '#fff', 
              fontWeight: 700, 
              letterSpacing: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            ĐỌC THÊM <ArrowForward sx={{ fontSize: 18 }} />
          </Typography>
        </Box>
      </Box>

      {/* Modern Progress Indicators */}
      {posts.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            display: 'flex',
            gap: 1.5,
          }}
        >
          {posts.map((_, i) => (
            <Box
              key={i}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                setActiveIndex(i);
              }}
              sx={{
                width: activeIndex === i ? 40 : 10,
                height: 4,
                borderRadius: 2,
                bgcolor: activeIndex === i ? theme.palette.primary.main : alpha('#fff', 0.3),
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': { bgcolor: activeIndex === i ? theme.palette.primary.main : alpha('#fff', 0.6) }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

// BlogPostCard is now imported from '@/components/Blog/BlogPostCard'

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
    <MainLayout>
      {/* Hero Header */}
      <Box
        sx={{
          position: 'relative',
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/blog-hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          py: isMobile ? 12 : 18,
          px: 3,
          mb: 0,
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{
              color: theme.palette.primary.light,
              fontWeight: 800,
              letterSpacing: 4,
              mb: 2,
              display: 'block',
              animation: 'fadeInUp 0.8s ease'
            }}
          >
            KHÁM PHÁ THẾ GIỚI LÀM ĐẸP
          </Typography>
          <Typography
            variant="h1"
            sx={{
              color: '#fff',
              fontWeight: 900,
              mb: 3,
              fontSize: isMobile ? '2.5rem' : '4.5rem',
              lineHeight: 1.1,
              textShadow: '0 4px 20px rgba(0,0,0,0.4)',
              animation: 'fadeInUp 1s ease'
            }}
          >
            Marlie <span style={{ color: theme.palette.primary.light }}>Insights</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: alpha('#fff', 0.9),
              fontWeight: 400,
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: '1.2rem',
              animation: 'fadeInUp 1.2s ease'
            }}
          >
            Nơi chia sẻ những bí quyết chăm sóc sắc đẹp, xu hướng nail thời thượng và nguồn cảm hứng bất tận cho phái đẹp.
          </Typography>

          {/* Glassmorphism Search Bar */}
          <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              alignItems: 'center',
              maxWidth: 600,
              mx: 'auto',
              borderRadius: 100,
              px: 3,
              py: 1,
              bgcolor: alpha('#fff', 0.15),
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: alpha('#fff', 0.2),
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              animation: 'fadeInUp 1.4s ease',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: alpha('#fff', 0.2),
                transform: 'translateY(-2px)'
              }
            }}
          >
            <SearchIcon sx={{ color: alpha('#fff', 0.8), mr: 2, fontSize: 24 }} />
            <InputBase
              placeholder="Bạn đang tìm kiếm điều gì?"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              sx={{ 
                flex: 1, 
                fontSize: '1.1rem',
                color: '#fff',
                '& input::placeholder': { color: alpha('#fff', 0.6) }
              }}
            />
            <IconButton 
              type="submit" 
              sx={{ 
                bgcolor: theme.palette.primary.main, 
                color: '#fff',
                p: 1.2,
                '&:hover': { bgcolor: theme.palette.primary.dark }
              }}
            >
              <ArrowForward />
            </IconButton>
          </Paper>
        </Container>
      </Box>

      {/* Elegant Sub-navigation / Featured Label */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: alpha(theme.palette.divider, 0.08), mb: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, gap: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>TẤT CẢ</Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>XU HƯỚNG</Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>SKINCARE</Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>NAIL ART</Typography>
          </Box>
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
                      onChange={(_: React.ChangeEvent<unknown>, value: number) => setPage(value)}
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
    </MainLayout>
  );
};

export default BlogHomePage;
