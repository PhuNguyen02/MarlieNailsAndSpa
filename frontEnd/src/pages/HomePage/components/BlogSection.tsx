import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Skeleton,
  alpha,
  useTheme,
  Button,
} from '@mui/material';
import { blogStyles } from '../styles';
import { publicBlogApi } from '@/api/blogApi';
import type { BlogPost } from '@/api/blogTypes';
import BlogPostCard from '@/components/Blog/BlogPostCard';
import { Link } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';

import { HomepageSection } from '@/api/homepageApi';

const BlogSection = ({ data }: { data?: HomepageSection }) => {
  const theme = useTheme();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await publicBlogApi.getPosts({ page: 1, limit: 3 });
        setPosts(response.items);
      } catch (error) {
        console.error('Failed to fetch latest posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <Box sx={blogStyles.container}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              letterSpacing: 3,
              mb: 2,
              display: 'block',
            }}
          >
            {data?.title || 'TIN TỨC & XU HƯỚNG'}
          </Typography>
          <Typography
            variant="h4"
            align="center"
            sx={{
              ...blogStyles.title,
              mb: 3,
            }}
          >
            {data?.subtitle || 'Blog & Cảm Hứng Làm Đẹp'}
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 4,
              bgcolor: 'primary.main',
              mx: 'auto',
              borderRadius: 2,
              mb: 4,
            }}
          />
          {data?.content && (
            <Box 
              sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }} 
              dangerouslySetInnerHTML={{ __html: data.content }} 
            />
          )}
          {!data?.content && (
            <Typography variant="body1" align="center" sx={blogStyles.subtitle}>
              Khám phá những bí quyết chăm sóc sắc đẹp, xu hướng nail mới nhất và những câu chuyện thư giãn từ Marlie Nails & Spa.
            </Typography>
          )}
        </Box>

        <Grid container spacing={4}>
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box sx={{ borderRadius: 4, overflow: 'hidden' }}>
                    <Skeleton variant="rectangular" height={240} />
                    <Box sx={{ p: 3 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" height={40} />
                      <Skeleton variant="text" height={80} />
                    </Box>
                  </Box>
                </Grid>
              ))
            : posts.map((post) => (
                <Grid item xs={12} md={4} key={post.id}>
                  <BlogPostCard post={post} />
                </Grid>
              ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Button
            component={Link}
            to="/blog"
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 'full',
              px: 6,
              py: 1.5,
              borderColor: alpha(theme.palette.primary.main, 0.4),
              color: 'primary.dark',
              fontWeight: 700,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Xem Tất Cả Bài Viết
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogSection;
